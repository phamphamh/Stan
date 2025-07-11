"use client"

import { Play, Heart, MessageCircle, Share, TrendingUp } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const mockTrendingClips = [
  {
    id: "1",
    title: "Icarus Aesthetic Edit",
    creator: "EditMaster",
    views: "125K",
    likes: 8900,
    comments: 234,
    thumbnail: "/placeholder.svg?height=200&width=150&text=Trending+1",
    isViral: true,
  },
  {
    id: "2",
    title: "Get Up Dance Cover",
    creator: "DanceQueen",
    views: "89K",
    likes: 6700,
    comments: 189,
    thumbnail: "/placeholder.svg?height=200&width=150&text=Trending+2",
    isViral: false,
  },
  {
    id: "3",
    title: "ARTMS Transition",
    creator: "TransitionPro",
    views: "67K",
    likes: 4500,
    comments: 156,
    thumbnail: "/placeholder.svg?height=200&width=150&text=Trending+3",
    isViral: true,
  },
]

export default function TrendingClips() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-red-400" />
        <h2 className="text-xl font-bold text-white">Clips tendance</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockTrendingClips.map((clip, index) => (
          <motion.div
            key={clip.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg bg-[#1a1f2c]"
          >
            <div className="relative">
              <Image
                src={clip.thumbnail || "/placeholder.svg"}
                alt={clip.title}
                width={150}
                height={200}
                className="h-40 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Viral badge */}
              {clip.isViral && (
                <div className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  🔥 VIRAL
                </div>
              )}

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-black/50 p-3">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Views */}
              <div className="absolute top-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                {clip.views} vues
              </div>
            </div>

            <div className="p-3">
              <h3 className="mb-1 text-sm font-bold text-white">{clip.title}</h3>
              <p className="mb-2 text-xs text-gray-400">par {clip.creator}</p>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{clip.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{clip.comments}</span>
                </div>
                <button className="ml-auto">
                  <Share className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
