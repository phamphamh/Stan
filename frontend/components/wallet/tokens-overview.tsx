"use client"

import { TrendingUp, Play, Gift, ShoppingCart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { useTokens } from "@/lib/tokens-context"
import { useTokenBalance } from "@/lib/contracts/artist"
import { useAccount } from "wagmi"

export default function TokensOverview() {
  const { tokens, transactions } = useTokens()
  const { balance, earnedBalance, refetchAll } = useTokenBalance()
  const { isConnected: wagmiConnected } = useAccount()

  // Utiliser les vrais tokens de la blockchain si connecté
  const displayTokens = wagmiConnected ? parseFloat(balance || '0') : tokens
  const displayEarnedTokens = wagmiConnected ? parseFloat(earnedBalance || '0') : 0

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Mission":
        return <Play className="h-4 w-4 text-green-500" />
      case "Lottery":
        return <Gift className="h-4 w-4 text-blue-500" />
      case "Purchase":
        return <ShoppingCart className="h-4 w-4 text-red-500" />
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Balance principale */}
      <div className="text-center">
        <div className="mb-2">
          <span className="text-4xl font-bold text-white">{displayTokens.toFixed(0)}</span>
          <span className="ml-2 text-lg text-gray-400">TOKENS</span>
        </div>
        
        {wagmiConnected && displayEarnedTokens > 0 && (
          <div className="mb-2">
            <span className="text-2xl font-bold text-yellow-400">{displayEarnedTokens.toFixed(0)}</span>
            <span className="ml-2 text-sm text-gray-400">EARNED TOKENS</span>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <TrendingUp className="h-4 w-4" />
          <span>BLACKPINK Fan Tokens</span>
          {wagmiConnected && (
            <Button
              size="sm"
              variant="ghost"
              onClick={refetchAll}
              className="ml-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {wagmiConnected && (
          <div className="mt-2 text-xs text-green-400">
            ✓ Connecté à la blockchain Chiliz
          </div>
        )}
      </div>

      {/* Transactions récentes */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Complete missions to earn tokens!</p>
            </div>
          ) : (
            transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-lg bg-[#1a1f2c] p-3">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-400">{formatDate(transaction.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="font-semibold"
                    style={{
                      color: transaction.amount > 0 ? config.group.theme.primary : "#ef4444",
                    }}
                  >
                    {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
