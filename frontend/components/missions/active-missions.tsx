"use client"

import { Gift, Clock, CheckCircle, Target, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion } from "framer-motion"
import Image from "next/image"

const activeMissions = [
  {
    id: 1,
    title: "Stream 'Pink Venom' 50 times",
    description: "Help us reach streaming goals",
    progress: 23,
    goal: 50,
    reward: "Exclusive BLACKPINK Photocard",
    timeLeft: "2 days left",
    image: "/placeholder.svg?height=80&width=80&text=Pink+Venom",
    type: "stream",
  },
  {
    id: 2,
    title: "Complete 5 Daily Challenges",
    description: "Finish today's mission streak",
    progress: 3,
    goal: 5,
    reward: "Limited Edition Sticker Pack",
    timeLeft: "12 hours left",
    image: "/placeholder.svg?height=80&width=80&text=Challenges",
    type: "daily",
  },
  {
    id: 3,
    title: "Share 3 BLACKPINK Posts",
    description: "Spread the love across social media",
    progress: 1,
    goal: 3,
    reward: "Digital Wallpaper Collection",
    timeLeft: "1 day left",
    image: "/placeholder.svg?height=80&width=80&text=Share",
    type: "social",
  },
]

export default function ActiveMissions() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Active Missions</h1>

        {/* Barre d'urgence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-600/20 border border-red-500 rounded-lg p-3 mb-4"
        >
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-semibold text-sm">
              THE MISSION WILL BE CLOSED IN 3 DAYS
            </span>
          </div>
        </motion.div>

        <p className="text-gray-400">Complete missions to win free BLACKPINK photocards</p>
      </div>

      <div className="space-y-4">
        {activeMissions.map((mission, index) => {
          const progressPercentage = (mission.progress / mission.goal) * 100
          const isCompleted = mission.progress >= mission.goal

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1f2c] rounded-lg p-4"
            >
              <div className="flex items-start gap-4">
                <Image
                  src={mission.image || "/placeholder.svg"}
                  alt={mission.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{mission.title}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{mission.timeLeft}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-3">{mission.description}</p>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white">
                        {mission.progress} / {mission.goal}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-700">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPercentage}%`,
                          backgroundColor: config.group.theme.primary,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4" style={{ color: config.group.theme.primary }} />
                      <span className="text-sm font-medium" style={{ color: config.group.theme.primary }}>
                        {mission.reward}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      disabled={isCompleted}
                      style={{
                        backgroundColor: isCompleted ? "#333" : config.group.theme.primary,
                        color: "white",
                      }}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Target className="mr-1 h-4 w-4" />
                          Continue
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}