'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Coins, LogOut, Wallet, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function PrivyWallet() {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const { wallets } = useWallets()

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('Adresse copiée!')
  }

  const openExplorer = (address: string) => {
    window.open(`https://spicy-explorer.chiliz.com/address/${address}`, '_blank')
  }

  if (!ready) {
    return <div className="p-4 text-center text-gray-400">Chargement...</div>
  }

  if (!authenticated) {
    return (
      <div className="space-y-4 p-4">
        <div className="text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-white mb-2">Connecter un Wallet</h3>
          <p className="text-sm text-gray-400 mb-4">
            Connectez-vous avec votre email ou wallet pour commencer
          </p>
        </div>
        <Button 
          onClick={login} 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        >
          Se connecter
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* User Info */}
      <div className="rounded-lg bg-[#1a1f2c] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Profil</h3>
            <p className="text-sm text-gray-400">
              {user?.email?.address || 'Utilisateur connecté'}
            </p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>


      {/* Wallets List */}
      {wallets.length > 0 && (
        <div className="rounded-lg bg-[#1a1f2c] p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Wallets connectés</h3>
          <div className="space-y-2">
            {wallets.map((wallet, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-700">
                <div>
                  <p className="text-sm font-medium text-white">{wallet.walletClientType}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400 font-mono">
                      {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                    </p>
                    <Button
                      onClick={() => copyAddress(wallet.address)}
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-gray-400 hover:text-white"
                    >
                      <Copy className="h-2 w-2" />
                    </Button>
                    <Button
                      onClick={() => openExplorer(wallet.address)}
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-gray-400 hover:text-white"
                    >
                      <ExternalLink className="h-2 w-2" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-green-400">Connecté</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}