"use client"

import { TrendingUp, Flame, Star } from "lucide-react"
import { config } from "@/lib/config"
import type { UserProgress } from "@/lib/types"

interface ProgressCardProps {
  progress?: UserProgress
}

export default function ProgressCard({ progress }: ProgressCardProps) {
  // const { selectedGroup } = useGroup()

  // Mock data par défaut si progress n'est pas fourni
  const defaultProgress: UserProgress = {
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    streak: 7,
    totalPoints: 15680,
  }

  const userProgress = progress || defaultProgress
  const xpPercentage = (userProgress.xp / userProgress.nextLevelXp) * 100

  return (
    <div className="rounded-lg bg-[#1a1f2c] p-4">
      <h3 className="mb-4 text-lg font-bold text-white">Votre progression</h3>

      <div className="space-y-4">
        {/* Level progress */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">Niveau {userProgress.level}</span>
            <span className="text-sm text-gray-400">
              {userProgress.xp}/{userProgress.nextLevelXp} XP
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-700">
            <div
              className="h-full rounded-full"
              style={{
                width: `${xpPercentage}%`,
                background: `linear-gradient(90deg, ${config.group.theme.primary}, ${config.group.theme.secondary})`,
              }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400">
              <Flame className="h-4 w-4" />
              <span className="text-lg font-bold">{userProgress.streak}</span>
            </div>
            <p className="text-xs text-gray-400">Jours consécutifs</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-400">
              <Star className="h-4 w-4" />
              <span className="text-lg font-bold">{userProgress.totalPoints.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">Points totaux</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1" style={{ color: config.group.theme.primary }}>
              <TrendingUp className="h-4 w-4" />
              <span className="text-lg font-bold">{userProgress.level}</span>
            </div>
            <p className="text-xs text-gray-400">Niveau</p>
          </div>
        </div>
      </div>
    </div>
  )
}
