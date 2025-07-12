'use client'

import { useAccount, useReadContract } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, CheckCircle, XCircle, Copy } from 'lucide-react'
import { toast } from 'sonner'

// ABI minimum pour vérifier le token ERC20
const ERC20_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol", 
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

interface TokenVerifierProps {
  tokenAddress?: `0x${string}`
  artistAddress?: `0x${string}`
}

export function TokenVerifier({ tokenAddress, artistAddress }: TokenVerifierProps) {
  const { address } = useAccount()

  // Lecture des informations du token
  const { data: tokenName } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'name',
    query: { enabled: !!tokenAddress }
  })

  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: { enabled: !!tokenAddress }
  })

  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!tokenAddress }
  })

  const { data: userBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!tokenAddress && !!address }
  })

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const openInExplorer = (address: string) => {
    window.open(`https://spicy-explorer.chiliz.com/address/${address}`, '_blank')
  }

  if (!tokenAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Token Not Found
          </CardTitle>
          <CardDescription>
            No token address detected. Create an artist first.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Token Verification
        </CardTitle>
        <CardDescription>
          Your Fan Token has been successfully deployed and is ready to use!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Token Name</div>
            <div className="text-lg font-semibold">{tokenName || 'Loading...'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Symbol</div>
            <div className="text-lg font-semibold">{tokenSymbol || 'Loading...'}</div>
          </div>
        </div>

        {/* Token Addresses */}
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Fan Token Address</div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded font-mono text-xs break-all">
              <span className="flex-1">{tokenAddress}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(tokenAddress, 'Token address')}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openInExplorer(tokenAddress)}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {artistAddress && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Artist Contract</div>
              <div className="flex items-center gap-2 p-2 bg-muted rounded font-mono text-xs break-all">
                <span className="flex-1">{artistAddress}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(artistAddress, 'Artist contract')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openInExplorer(artistAddress)}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Token Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total Supply</div>
            <div className="text-lg font-semibold">
              {totalSupply ? totalSupply.toString() : '0'} {tokenSymbol}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Your Balance</div>
            <div className="text-lg font-semibold">
              {userBalance ? userBalance.toString() : '0'} {tokenSymbol}
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="bg-green-500">
            ✅ Token Deployed
          </Badge>
          <Badge variant="secondary">
            🔗 Chiliz Testnet
          </Badge>
          {tokenName && tokenSymbol && (
            <Badge variant="outline">
              📊 ERC20 Compatible
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openInExplorer(tokenAddress)}
            >
              View in Explorer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(tokenAddress, 'Token address')}
            >
              Copy Token Address
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}