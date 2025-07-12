"use client"

import { Coins, TrendingUp, Plus, ArrowUpDown, History, Play, ShoppingCart, Gift, Star } from "lucide-react"
import { config } from "@/lib/config"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function TokensOverview() {
  const { group, user } = config

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earn":
        return <Play className="h-4 w-4 text-green-400" />
      case "spend":
        return <Gift className="h-4 w-4 text-red-400" />
      case "buy":
        return <ShoppingCart className="h-4 w-4 text-blue-400" />
      default:
        return <Coins className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header avec total */}
      <div className="rounded-lg bg-[#1a1f2c] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Total Balance</h2>
            <p className="text-sm text-gray-400">Your {group.displayName} tokens</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2" style={{ color: group.theme.primary }}>
              <Coins className="h-6 w-6" />
              <span className="text-2xl font-bold">{user.tokens.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="h-3 w-3" />
              <span>+5.2% (24h)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-4 gap-3">
        <Button className="flex flex-col gap-1 h-16 text-white" style={{ backgroundColor: group.theme.primary }}>
          <Plus className="h-5 w-5" />
          <span className="text-xs">Buy</span>
        </Button>
        <Button className="flex flex-col gap-1 h-16 bg-gray-700 text-gray-300 hover:bg-gray-600">
          <ArrowUpDown className="h-5 w-5" />
          <span className="text-xs">Exchange</span>
        </Button>
        <Button className="flex flex-col gap-1 h-16 bg-gray-700 text-gray-300 hover:bg-gray-600">
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs">Analyze</span>
        </Button>
        <Button className="flex flex-col gap-1 h-16 bg-gray-700 text-gray-300 hover:bg-gray-600">
          <History className="h-5 w-5" />
          <span className="text-xs">History</span>
        </Button>
      </div>

      {/* Transactions récentes */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        <div className="space-y-2">
          {[
            { type: "earn", amount: "+50", desc: "Clip Farm - 'Pink Venom' Edit", time: "3h ago", category: "Mission" },
            { type: "spend", amount: "-250", desc: "Fan Call Lottery", time: "1d ago", category: "Lottery" },
            { type: "earn", amount: "+25", desc: "Stream Mission", time: "2d ago", category: "Mission" },
            { type: "buy", amount: "+100", desc: "Token Purchase", time: "4d ago", category: "Purchase" },
          ].map((tx, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg bg-[#1a1f2c] p-4 hover:bg-[#1e2330] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                    tx.type === "earn" || tx.type === "buy"
                      ? "bg-green-500/20 border-green-500/30"
                      : "bg-red-500/20 border-red-500/30"
                  }`}
                >
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{tx.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{tx.time}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold text-base ${
                    tx.type === "earn" || tx.type === "buy" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {tx.amount}
                </p>
                <p className="text-xs text-gray-400">Tokens</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <Button
          variant="outline"
          className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          View All Transactions
        </Button>
      </div>
    </div>
  )
}
