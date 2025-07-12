"use client"

import { Award, Calendar, Star, Trophy, Medal, Crown } from "lucide-react"
import Image from "next/image"
import { config } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTokens } from "@/lib/tokens-context"

interface UserProfileProps {
  userId: string
}

// Mock data for different users
const getUserData = (userId: string, tokens: number, completedMissions: number) => {
  const level = Math.floor(completedMissions / 2) + 1 // Level increases every 2 missions

  const users = {
    "1": {
      id: "1",
      username: "BlinkQueen",
      bio: "BLACKPINK forever 💖 Jennie bias since 2016. Content creator and devoted fan!",
      avatar: "/placeholder.svg?height=120&width=120&text=BlinkQueen",
      level,
      tokensEarned: tokens,
      joinDate: "March 2022",
      rank: 1,
      badges: [
        { name: "BLINK #1", icon: Star, color: config.group.theme.primary },
        { name: "Top Streamer", icon: Award, color: "#fbbf24" },
        { name: "Creator", icon: Trophy, color: "#8b5cf6" },
        { name: "Loyal Fan", icon: Calendar, color: "#06b6d4" },
      ],
    },
    "2": {
      id: "2",
      username: "LisaLover",
      bio: "Lisa stan 🌙 Amateur dancer and photocard collector. BORN PINK era best era!",
      avatar: "/placeholder.svg?height=120&width=120&text=LisaLover",
      level,
      tokensEarned: tokens,
      joinDate: "June 2022",
      rank: 2,
      badges: [
        { name: "Dancer", icon: Star, color: "#f59e0b" },
        { name: "Collector", icon: Award, color: "#10b981" },
        { name: "Active Fan", icon: Calendar, color: "#3b82f6" },
      ],
    },
    "3": {
      id: "3",
      username: "RoseFan",
      bio: "Rosé voice = heaven 🌹 Guitarist and ballad lover. How You Like That changed my life!",
      avatar: "/placeholder.svg?height=120&width=120&text=RoseFan",
      level,
      tokensEarned: tokens,
      joinDate: "August 2022",
      rank: 3,
      badges: [
        { name: "Musician", icon: Star, color: "#ec4899" },
        { name: "Music Lover", icon: Award, color: "#8b5cf6" },
      ],
    },
  }

  return users[userId] || users["1"] // Default to first user if not found
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { tokens, missions } = useTokens()
  const completedMissions = missions.filter(m => m.isCompleted).length
  const user = getUserData(userId, tokens, completedMissions)

  const getRankIcon = () => {
    switch (user.rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Trophy className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-2xl font-bold text-gray-400">#{user.rank}</span>
    }
  }

  const getRankText = () => {
    switch (user.rank) {
      case 1:
        return "👑 Leaderboard leader"
      case 2:
        return "🥈 2nd place"
      case 3:
        return "🥉 3rd place"
      default:
        return `#${user.rank} in leaderboard`
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="relative inline-block">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.username}
            width={120}
            height={120}
            className="rounded-full mx-auto border-4"
            style={{ borderColor: user.rank <= 3 ? config.group.theme.primary : "#374151" }}
          />
          {user.rank <= 3 && (
            <div className="absolute -bottom-2 -right-2 rounded-full bg-[#0a0f1b] p-2">{getRankIcon()}</div>
          )}
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">{user.username}</h1>
        <p className="text-gray-400">Level {user.level} • BLACKPINK Stan</p>
        <p className="text-sm" style={{ color: config.group.theme.primary }}>
          {getRankText()}
        </p>
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <p className="text-gray-300 leading-relaxed">{user.bio}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 text-center"
      >
        <div className="rounded-lg bg-[#1a1f2c] p-4">
          <div className="flex items-center justify-center gap-1 mb-2" style={{ color: config.group.theme.primary }}>
            <Trophy className="h-5 w-5" />
            <span className="text-xl font-bold">{user.tokensEarned}</span>
          </div>
          <p className="text-sm text-gray-400">Tokens Earned</p>
        </div>
        <div className="rounded-lg bg-[#1a1f2c] p-4">
          <div className="flex items-center justify-center gap-1 mb-2 text-yellow-400">
            <Award className="h-5 w-5" />
            <span className="text-xl font-bold">{user.level}</span>
          </div>
          <p className="text-sm text-gray-400">Level</p>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-lg bg-[#1a1f2c] p-4"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Badges</h3>
        <div className="grid grid-cols-4 gap-3">
          {user.badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: badge.color + "30" }}
              >
                <badge.icon className="h-6 w-6" style={{ color: badge.color }} />
              </div>
              <span className="text-xs text-gray-400 text-center">{badge.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Member Since */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-lg bg-[#1a1f2c] p-4"
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-white font-semibold">Member since</p>
            <p className="text-sm text-gray-400">{user.joinDate}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
