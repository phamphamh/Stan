"use client"

import { Award, Calendar, Star, Trophy, Medal, Crown, Share, MessageCircle } from "lucide-react"
import Image from "next/image"
import { config } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface UserProfileProps {
  userId: string
}

// Mock data for different users
const getUserData = (userId: string) => {
  const users = {
    "1": {
      id: "1",
      username: "OrbitalFan",
      bio: "BLACKPINK forever 💖 Jennie bias depuis 2016. Créatrice de contenu et fan inconditionnelle !",
      avatar: "/placeholder.svg?height=120&width=120&text=OrbitalFan",
      level: 28,
      tokensEarned: 2680,
      activeDays: 245,
      joinDate: "Mars 2022",
      rank: 1,
      badges: [
        { name: "BLINK #1", icon: Star, color: config.group.theme.primary },
        { name: "Top Streamer", icon: Award, color: "#fbbf24" },
        { name: "Créateur", icon: Trophy, color: "#8b5cf6" },
        { name: "Fidèle", icon: Calendar, color: "#06b6d4" },
      ],
    },
    "2": {
      id: "2",
      username: "LunarOrbit",
      bio: "Lisa stan 🌙 Danseuse amateur et collectionneuse de photocards. BORN PINK era best era!",
      avatar: "/placeholder.svg?height=120&width=120&text=LunarOrbit",
      level: 25,
      tokensEarned: 2450,
      activeDays: 198,
      joinDate: "Juin 2022",
      rank: 2,
      badges: [
        { name: "Danseur", icon: Star, color: "#f59e0b" },
        { name: "Collectionneur", icon: Award, color: "#10b981" },
        { name: "Actif", icon: Calendar, color: "#3b82f6" },
      ],
    },
    "3": {
      id: "3",
      username: "StarGazer",
      bio: "Rosé voice = heaven 🌹 Guitariste et fan de ballades. How You Like That changed my life!",
      avatar: "/placeholder.svg?height=120&width=120&text=StarGazer",
      level: 23,
      tokensEarned: 2390,
      activeDays: 167,
      joinDate: "Août 2022",
      rank: 3,
      badges: [
        { name: "Musicien", icon: Star, color: "#ec4899" },
        { name: "Mélomane", icon: Award, color: "#8b5cf6" },
      ],
    },
  }

  return users[userId] || users["1"] // Default to first user if not found
}

export default function UserProfile({ userId }: UserProfileProps) {
  const user = getUserData(userId)

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
        return "👑 Leader du classement"
      case 2:
        return "🥈 2ème place"
      case 3:
        return "🥉 3ème place"
      default:
        return `#${user.rank} au classement`
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
        <p className="text-gray-400">Niveau {user.level} • BLACKPINK Stan</p>
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
        className="grid grid-cols-3 gap-4 text-center"
      >
        <div className="rounded-lg bg-[#1a1f2c] p-4">
          <div className="flex items-center justify-center gap-1 mb-2" style={{ color: config.group.theme.primary }}>
            <Trophy className="h-5 w-5" />
            <span className="text-xl font-bold">{user.tokensEarned}</span>
          </div>
          <p className="text-sm text-gray-400">Tokens Earned</p>
        </div>
        <div className="rounded-lg bg-[#1a1f2c] p-4">
          <div className="flex items-center justify-center gap-1 mb-2 text-orange-400">
            <Calendar className="h-5 w-5" />
            <span className="text-xl font-bold">{user.activeDays}</span>
          </div>
          <p className="text-sm text-gray-400">Jours actifs</p>
        </div>
        <div className="rounded-lg bg-[#1a1f2c] p-4">
          <div className="flex items-center justify-center gap-1 mb-2 text-yellow-400">
            <Award className="h-5 w-5" />
            <span className="text-xl font-bold">{user.level}</span>
          </div>
          <p className="text-sm text-gray-400">Niveau</p>
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
            <p className="text-white font-semibold">Membre depuis</p>
            <p className="text-sm text-gray-400">{user.joinDate}</p>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <Button className="flex-1 gap-2" style={{ backgroundColor: config.group.theme.primary }}>
          <MessageCircle className="h-4 w-4" />
          Message
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Share className="h-4 w-4" />
          Partager
        </Button>
      </motion.div>
    </div>
  )
}
