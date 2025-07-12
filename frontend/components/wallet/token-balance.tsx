"use client"

import { useBlockchain } from "@/lib/blockchain-context"
import { Coins, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function TokenBalance() {
  const { balance, earnedBalance, tokenSymbol, isConnected } = useBlockchain()
  const [showBalance, setShowBalance] = useState(true)

  if (!isConnected) {
    return (
      <div className="rounded-lg bg-[#1a1f2c] p-4">
        <div className="text-center text-gray-400">
          <Coins className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Connectez votre wallet pour voir vos tokens</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coins className="h-6 w-6 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">Tokens {tokenSymbol}</h3>
        </div>
        <Button
          onClick={() => setShowBalance(!showBalance)}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      <div className="space-y-3">
        {/* Solde Total */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Solde Total</span>
          <span className="text-lg font-bold text-white">
            {showBalance ? `${balance} ${tokenSymbol}` : '••••••'}
          </span>
        </div>

        {/* Tokens Gagnés */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Tokens Gagnés</span>
          <span className="text-lg font-bold text-pink-400">
            {showBalance ? `${earnedBalance} ${tokenSymbol}` : '••••••'}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progression</span>
            <span>{showBalance ? `${earnedBalance}/${balance}` : '••••••'}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              style={{
                width: balance !== '0' ? `${(parseFloat(earnedBalance) / parseFloat(balance)) * 100}%` : '0%'
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Complétez des missions pour gagner plus de tokens {tokenSymbol}
      </div>
    </div>
  )
}