"use client"

import { Clock, Coins, Users, Play } from "lucide-react"
import { config } from "@/lib/config"
import Image from "next/image"
import { motion } from "framer-motion"

const blackpinkChallenges = [
  {
    id: "1",
    title: "'Pink Venom' Edit Challenge",
    description: "Create an edit on the Pink Venom MV",
    song: "BLACKPINK - Pink Venom",
    tokenType: "BP",
    prize: 750,
    participants: 123,
    clipsSubmitted: 88,
    timeLeft: "2j 8h",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Pink+Venom+Challenge",
  },
  {
    id: "2",
    title: "'How You Like That' Dance",
    description: "Show off your best dance moves",
    song: "BLACKPINK - How You Like That",
    tokenType: "BP",
    prize: 500,
    participants: 210,
    clipsSubmitted: 150,
    timeLeft: "4j 1h",
    thumbnail: "/placeholder.svg?height=120&width=200&text=HYLT+Challenge",
  },
]

export default function ActiveChallenges() {
  const challenges = blackpinkChallenges

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">{"Active Challenges - BLACKPINK"}</h2>

      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="overflow-hidden rounded-lg bg-[#1a1f2c]"
          >
            <div className="flex">
              <div className="relative">
                <Image
                  src={challenge.thumbnail || "/placeholder.svg"}
                  alt={challenge.title}
                  width={120}
                  height={80}
                  className="h-20 w-30 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex-1 p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white">{challenge.title}</h3>
                    <p className="text-xs text-gray-400">{challenge.description}</p>
                  </div>
                  <div
                    className="rounded-full px-2 py-1 text-xs font-semibold"
                    style={{ backgroundColor: config.group.theme.primary + "20", color: config.group.theme.primary }}
                  >
                    {challenge.tokenType}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-2">🎵 {challenge.song}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1" style={{ color: config.group.theme.primary }}>
                    <Coins className="h-3 w-3" />
                    <span>{challenge.prize} tokens</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400">
                    <Clock className="h-3 w-3" />
                    <span>{challenge.timeLeft}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Users className="h-3 w-3" />
                    <span>{challenge.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <Play className="h-3 w-3" />
                    <span>{challenge.clipsSubmitted} clips</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
