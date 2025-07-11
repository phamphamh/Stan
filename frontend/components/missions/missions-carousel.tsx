"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Music, Video, ShoppingCart, Play, Heart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const missions = [
  {
    id: "spotify",
    title: "Écouter sur Spotify",
    description: "Stream 5 chansons ARTMS",
    icon: Music,
    reward: "50 XP",
    progress: 3,
    maxProgress: 5,
    color: "from-green-500 to-green-600",
  },
  {
    id: "clipfarm",
    title: "Regarder des clips",
    description: "Visionner 10 clips musicaux",
    icon: Video,
    reward: "75 XP",
    progress: 7,
    maxProgress: 10,
    color: "from-red-500 to-red-600",
  },
  {
    id: "stream",
    title: "Stream en direct",
    description: "Participer à 3 lives",
    icon: Play,
    reward: "100 XP",
    progress: 1,
    maxProgress: 3,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "buy",
    title: "Acheter des objets",
    description: "Acheter 2 objets dans le shop",
    icon: ShoppingCart,
    reward: "200 XP",
    progress: 0,
    maxProgress: 2,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "like",
    title: "Liker du contenu",
    description: "Liker 20 posts",
    icon: Heart,
    reward: "25 XP",
    progress: 15,
    maxProgress: 20,
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "social",
    title: "Inviter des amis",
    description: "Inviter 3 nouveaux fans",
    icon: Users,
    reward: "300 XP",
    progress: 1,
    maxProgress: 3,
    color: "from-yellow-500 to-yellow-600",
  },
]

export default function MissionsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="space-y-4">
      {/* Carousel horizontal */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {missions.map((mission, index) => {
          const progressPercentage = (mission.progress / mission.maxProgress) * 100
          const isCompleted = mission.progress >= mission.maxProgress

          return (
            <motion.div
              key={mission.id}
              className={`min-w-[280px] rounded-lg bg-gradient-to-br ${mission.color} p-4 text-white`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <mission.icon className="h-8 w-8" />
                <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold">{mission.reward}</span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold">{mission.title}</h3>
                <p className="text-sm opacity-90">{mission.description}</p>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Progression</span>
                  <span>
                    {mission.progress}/{mission.maxProgress}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/20">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <Button className="mt-4 w-full bg-white/20 text-white hover:bg-white/30" disabled={isCompleted}>
                {isCompleted ? "Terminé ✓" : "Continuer"}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
