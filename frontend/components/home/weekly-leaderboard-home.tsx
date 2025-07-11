"use client"

import { Crown, ChevronRight } from "lucide-react"
import Image from "next/image"
import { config } from "@/lib/config"
import Link from "next/link"
import { motion } from "framer-motion"

const mockLeaderboard = [
  { id: "1", username: "OrbitalFan", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 2680, rank: 1 },
  { id: "2", username: "LunarOrbit", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 2450, rank: 2 },
  { id: "3", username: "StarGazer", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 2390, rank: 3 },
]

export default function WeeklyLeaderboardHome() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🏆 Podium de cette semaine</h2>
        <Link
          href="/leaderboard"
          className="flex items-center gap-1 text-sm"
          style={{ color: config.group.theme.primary }}
        >
          <span>Voir tout</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-lg bg-[#1a1f2c] p-4">
        <p className="text-xs text-gray-400 mb-4">Classement basé sur les tokens gagnés via les missions</p>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* 2ème place */}
          <Link href={`/profile/${mockLeaderboard[1].id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="h-16 w-full rounded-lg bg-gradient-to-b from-gray-400 to-gray-600 flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <Image
                  src={mockLeaderboard[1].avatar || "/placeholder.svg"}
                  alt={mockLeaderboard[1].username}
                  width={32}
                  height={32}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 rounded-full border-2 border-gray-400"
                />
              </div>
              <p className="text-xs font-semibold text-white mt-2">{mockLeaderboard[1].username}</p>
              <p className="text-xs text-gray-400">{mockLeaderboard[1].tokensEarned} tokens</p>
            </motion.div>
          </Link>

          {/* 1ère place */}
          <Link href={`/profile/${mockLeaderboard[0].id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="h-20 w-full rounded-lg bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-end justify-center pb-2">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <Image
                  src={mockLeaderboard[0].avatar || "/placeholder.svg"}
                  alt={mockLeaderboard[0].username}
                  width={40}
                  height={40}
                  className="absolute -top-5 left-1/2 transform -translate-x-1/2 rounded-full border-2 border-yellow-400"
                />
              </div>
              <p className="text-xs font-semibold text-white mt-2">{mockLeaderboard[0].username}</p>
              <p className="text-xs text-gray-400">{mockLeaderboard[0].tokensEarned} tokens</p>
            </motion.div>
          </Link>

          {/* 3ème place */}
          <Link href={`/profile/${mockLeaderboard[2].id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="h-12 w-full rounded-lg bg-gradient-to-b from-amber-600 to-amber-800 flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <Image
                  src={mockLeaderboard[2].avatar || "/placeholder.svg"}
                  alt={mockLeaderboard[2].username}
                  width={32}
                  height={32}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 rounded-full border-2 border-amber-600"
                />
              </div>
              <p className="text-xs font-semibold text-white mt-2">{mockLeaderboard[2].username}</p>
              <p className="text-xs text-gray-400">{mockLeaderboard[2].tokensEarned} tokens</p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}
