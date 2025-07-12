'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnector() {
  const { login, logout, ready, authenticated, user } = usePrivy()
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    if (!ready) return
    login()
  }

  const handleDisconnect = () => {
    logout()
    disconnect()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!ready) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex justify-center items-center p-6">
          <div>Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (!authenticated || !isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to interact with the artist platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleConnect} 
            className="w-full"
            size="lg"
          >
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Address</div>
          <div className="text-sm text-muted-foreground font-mono">
            {address && formatAddress(address)}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Network</div>
          <Badge variant={chainId === 88882 ? 'default' : 'destructive'}>
            {chainId === 88882 ? 'Chiliz Testnet' : `Chain ${chainId}`}
          </Badge>
        </div>

        {user?.email && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Email</div>
            <div className="text-sm text-muted-foreground">
              {user.email.address}
            </div>
          </div>
        )}

        <Button 
          onClick={handleDisconnect}
          variant="outline"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </CardContent>
    </Card>
  )
}