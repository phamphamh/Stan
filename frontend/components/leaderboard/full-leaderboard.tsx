"use client"

import { Trophy, Medal, Award, Crown } from "lucide-react"
import Image from "next/image"
import { config } from "@/lib/config"
import { motion } from "framer-motion"
import Link from "next/link"

// Top 20 de cette semaine (tokens earned via missions)
const currentWeekLeaderboard = [
  { id: "1", username: "OrbitalFan", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 2680, rank: 1 },
  { id: "2", username: "LunarOrbit", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 2450, rank: 2 },
  { id: "3", username: "StarGazer", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 2390, rank: 3 },
  { id: "4", username: "CosmicDream", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 2150, rank: 4 },
  { id: "5", username: "GalaxyHeart", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1920, rank: 5 },
  { id: "6", username: "NebulaFan", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1890, rank: 6 },
  { id: "7", username: "StellarBlink", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1756, rank: 7 },
  { id: "8", username: "AstroLover", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1687, rank: 8 },
  { id: "9", username: "MeteorStrike", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1554, rank: 9 },
  { id: "10", username: "CometTail", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1421, rank: 10 },
  { id: "11", username: "PlanetaryFan", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1298, rank: 11 },
  { id: "12", username: "SolarFlare", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1165, rank: 12 },
  { id: "13", username: "BlackHole", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 1032, rank: 13 },
  { id: "14", username: "Supernova", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 999, rank: 14 },
  { id: "15", username: "Quasar", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 866, rank: 15 },
  { id: "16", username: "Pulsar", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 733, rank: 16 },
  { id: "17", username: "Asteroid", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 650, rank: 17 },
  { id: "18", username: "Satellite", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 567, rank: 18 },
  { id: "19", username: "Cosmos", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 434, rank: 19 },
  { id: "20", username: "Universe", avatar: "/placeholder.svg?height=40&width=40", tokensEarned: 301, rank: 20 },
]

export default function FullLeaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Top 3 de cette semaine - Podium */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">🏆 Podium de cette semaine</h2>
        <p className="text-sm text-gray-400">Classement basé sur les tokens gagnés via les missions</p>
        <div className="grid grid-cols-3 gap-2">
          {/* 2ème place */}
          <Link href={`/profile/${currentWeekLeaderboard[1].id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="h-20 w-full rounded-lg bg-gradient-to-b from-gray-400 to-gray-600 flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <Image
                  src={currentWeekLeaderboard[1].avatar || "/placeholder.svg"}
                  alt={currentWeekLeaderboard[1].username}
                  width={40}
                  height={40}
                  className="absolute -top-5 left-1/2 transform -translate-x-1/2 rounded-full border-2 border-gray-400"
                />
              </div>
              <p className="text-sm font-semibold text-white mt-2">{currentWeekLeaderboard[1].username}</p>
              <p className="text-xs text-gray-400">{currentWeekLeaderboard[1].tokensEarned} tokens</p>
            </motion.div>
          </Link>

          {/* 1ère place */}
          <Link href={`/profile/${currentWeekLeaderboard[0].id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="h-24 w-full rounded-lg bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-end justify-center pb-2">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <Image
                  src={currentWeekLeaderboard[0].avatar || "/placeholder.svg"}
                  alt={currentWeekLeaderboard[0].username}
                  width={48}
                  height={48}
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 rounded-full border-2 border-yellow-400"
                />
              </div>
              <p className="text-sm font-semibold text-white mt-2">{currentWeekLeaderboard[0].username}</p>
              <p className="text-xs text-gray-400">{currentWeekLeaderboard[0].tokensEarned} tokens</p>
            </motion.div>
          </Link>

          {/* 3ème place */}
          <Link href={`/profile/${currentWeekLeaderboard[2].id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="h-16 w-full rounded-lg bg-gradient-to-b from-amber-600 to-amber-800 flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <Image
                  src={currentWeekLeaderboard[2].avatar || "/placeholder.svg"}
                  alt={currentWeekLeaderboard[2].username}
                  width={40}
                  height={40}
                  className="absolute -top-5 left-1/2 transform -translate-x-1/2 rounded-full border-2 border-amber-600"
                />
              </div>
              <p className="text-sm font-semibold text-white mt-2">{currentWeekLeaderboard[2].username}</p>
              <p className="text-xs text-gray-400">{currentWeekLeaderboard[2].tokensEarned} tokens</p>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Classement complet de cette semaine */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">📊 Top 20 - Cette semaine</h2>
        <div className="space-y-2">
          {currentWeekLeaderboard.map((user, index) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-4 rounded-lg p-3 cursor-pointer hover:bg-opacity-80 transition-all ${
                  user.rank <= 3 ? "bg-gradient-to-r from-[#1a1f2c] to-[#252b3a]" : "bg-[#1a1f2c] hover:bg-[#252b3a]"
                }`}
              >
                <div className="flex w-8 justify-center">{getRankIcon(user.rank)}</div>
                <Image
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-white">{user.username}</p>
                  <p className="text-sm text-gray-400">{user.tokensEarned} tokens earned</p>
                </div>
                {user.rank === 1 && (
                  <div
                    className="rounded-full px-2 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: config.group.theme.primary + "20",
                      color: config.group.theme.primary,
                    }}
                  >
                    👑 Leader
                  </div>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
