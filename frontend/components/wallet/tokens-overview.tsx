"use client"

import { Coins, TrendingUp, Plus, ArrowUpDown, History } from "lucide-react"
import { config } from "@/lib/config"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function TokensOverview() {
  const { group, user } = config

  return (
    <div className="space-y-6">
      {/* Header avec total */}
      <div className="rounded-lg bg-[#1a1f2c] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Solde Total</h2>
            <p className="text-sm text-gray-400">Vos tokens {group.displayName}</p>
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
          <span className="text-xs">Acheter</span>
        </Button>
        <Button className="flex flex-col gap-1 h-16 bg-gray-700 text-gray-300 hover:bg-gray-600">
          <ArrowUpDown className="h-5 w-5" />
          <span className="text-xs">Échanger</span>
        </Button>
        <Button className="flex flex-col gap-1 h-16 bg-gray-700 text-gray-300 hover:bg-gray-600">
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs">Analyser</span>
        </Button>
        <Button className="flex flex-col gap-1 h-16 bg-gray-700 text-gray-300 hover:bg-gray-600">
          <History className="h-5 w-5" />
          <span className="text-xs">Historique</span>
        </Button>
      </div>

      {/* Transactions récentes */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Transactions récentes</h3>
        <div className="space-y-2">
          {[
            { type: "earn", amount: "+50", desc: "Clip Farm - 'Pink Venom' Edit", time: "3h" },
            { type: "spend", amount: "-250", desc: "Loterie Fan Call", time: "1j" },
            { type: "earn", amount: "+25", desc: "Mission de stream", time: "2j" },
            { type: "buy", amount: "+100", desc: "Achat de tokens", time: "4j" },
          ].map((tx, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg bg-[#1a1f2c] p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    tx.type === "earn" || tx.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  {tx.type === "earn" || tx.type === "buy" ? "+" : "-"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{tx.desc}</p>
                  <p className="text-xs text-gray-400">{tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${tx.type === "earn" || tx.type === "buy" ? "text-green-400" : "text-red-400"}`}
                >
                  {tx.amount}
                </p>
                <p className="text-xs text-gray-400">Tokens</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
