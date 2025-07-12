"use client"

import { Award, Calendar, Star, Trophy, Medal, Crown, TrendingUp } from "lucide-react"
import Image from "next/image"
import { config } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTokens } from "@/lib/tokens-context"

interface UserProfileProps {
  userId: string
}

// Mock data for different users with better avatars
const getUserData = (userId: string, tokens: number, level: number, earnedBadges: any[]) => {
  const users = {
    "1": {
      id: "1",
      username: "BlinkQueen",
      bio: "BLACKPINK forever 💖 Jennie bias since 2016. Content creator and devoted fan!",
      avatar: "/placeholder.svg?height=120&width=120&text=BQ&bg=e91e63&color=white",
      level,
      tokensEarned: tokens,
      joinDate: "March 2022",
      rank: 1,
      badges: earnedBadges,
    },
    "2": {
      id: "2",
      username: "LisaLover",
      bio: "Lisa stan 🌙 Amateur dancer and photocard collector. BORN PINK era best era!",
      avatar: "/placeholder.svg?height=120&width=120&text=LL&bg=fbbf24&color=white",
      level,
      tokensEarned: tokens,
      joinDate: "June 2022",
      rank: 2,
      badges: earnedBadges,
    },
    "3": {
      id: "3",
      username: "RoseFan",
      bio: "Rosé voice = heaven 🌹 Guitarist and ballad lover. How You Like That changed my life!",
      avatar: "/placeholder.svg?height=120&width=120&text=RF&bg=ec4899&color=white",
      level,
      tokensEarned: tokens,
      joinDate: "August 2022",
      rank: 3,
      badges: earnedBadges,
    },
  }

  return users[userId as keyof typeof users] || users["1"] // Default to first user if not found
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { tokens, level, xp, xpToNextLevel, earnedBadges } = useTokens()
  const user = getUserData(userId, tokens, level, earnedBadges)

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
        return "👑 Leaderboard Leader"
      case 2:
        return "🥈 2nd Place"
      case 3:
        return "🥉 3rd Place"
      default:
        return `#${user.rank} in Leaderboard`
    }
  }

  const getProgressPercentage = () => {
    return Math.min((xp / xpToNextLevel) * 100, 100)
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

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-lg bg-[#1a1f2c] p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span className="text-white font-semibold">Level Progress</span>
          </div>
          <span className="text-sm text-gray-400">{xp} / {xpToNextLevel} XP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {xpToNextLevel - xp} XP to Level {level + 1}
        </p>
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
          <div className="flex items-center justify-center gap-1 mb-2 text-blue-400">
            <Award className="h-5 w-5" />
            <span className="text-xl font-bold">{user.level}</span>
          </div>
          <p className="text-sm text-gray-400">Current Level</p>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-lg bg-[#1a1f2c] p-4"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Earned Badges</h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {earnedBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 relative"
                  style={{
                    backgroundColor: badge.color + "20",
                    borderColor: badge.color
                  }}
                >
                  <badge.icon className="h-8 w-8" style={{ color: badge.color }} />
                  {badge.rarity === "legendary" && (
                    <div className="absolute -top-1 -right-1 text-yellow-400">
                      <Crown className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-xs text-white font-medium">{badge.name}</span>
                  <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No badges earned yet</p>
            <p className="text-sm text-gray-500">Complete missions to earn your first badge!</p>
          </div>
        )}
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
            <p className="text-white font-semibold">Member Since</p>
            <p className="text-sm text-gray-400">{user.joinDate}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
