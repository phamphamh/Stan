"use client"

import { Play, Heart, MessageCircle, Share, Youtube, Music2, TrendingUp, Eye, Clock } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { config } from "@/lib/config"

const mockMyClips = [
  {
    id: "1",
    title: "ARTMS Icarus Edit",
    platform: "tiktok",
    views: "45.2K",
    likes: 3200,
    comments: 89,
    shares: 156,
    tokensEarned: 125,
    thumbnail: "/placeholder.svg?height=200&width=150&text=My+Clip+1",
    uploadDate: "2j",
    challenge: "Icarus Edit Challenge",
    isViral: true,
  },
  {
    id: "2",
    title: "NewJeans Get Up Dance",
    platform: "youtube",
    views: "12.8K",
    likes: 890,
    comments: 45,
    shares: 67,
    tokensEarned: 75,
    thumbnail: "/placeholder.svg?height=200&width=150&text=My+Clip+2",
    uploadDate: "5j",
    challenge: "Get Up Dance Challenge",
    isViral: false,
  },
  {
    id: "3",
    title: "IVE Baddie Transition",
    platform: "tiktok",
    views: "89.1K",
    likes: 6700,
    comments: 234,
    shares: 445,
    tokensEarned: 200,
    thumbnail: "/placeholder.svg?height=200&width=150&text=My+Clip+3",
    uploadDate: "1sem",
    challenge: "Baddie Transition Challenge",
    isViral: true,
  },
]

export default function MyClips() {
  const totalViews = mockMyClips.reduce((sum, clip) => {
    const views = Number.parseFloat(clip.views.replace("K", "")) * 1000
    return sum + views
  }, 0)

  const totalTokensEarned = mockMyClips.reduce((sum, clip) => sum + clip.tokensEarned, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">My Clips</h2>
        <span className="text-sm text-gray-400">{mockMyClips.length} clips</span>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-[#1a1f2c] p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1 text-blue-400">
            <Eye className="h-4 w-4" />
            <span className="text-lg font-bold">{(totalViews / 1000).toFixed(1)}K</span>
          </div>
          <p className="text-xs text-gray-400">Total viewss</p>
        </div>
        <div className="rounded-lg bg-[#1a1f2c] p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1" style={{ color: config.group.theme.primary }}>
            <TrendingUp className="h-4 w-4" />
            <span className="text-lg font-bold">{totalTokensEarned}</span>
          </div>
          <p className="text-xs text-gray-400">Tokens earned</p>
        </div>
        <div className="rounded-lg bg-[#1a1f2c] p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1 text-red-400">
            <Play className="h-4 w-4" />
            <span className="text-lg font-bold">{mockMyClips.filter((clip) => clip.isViral).length}</span>
          </div>
          <p className="text-xs text-gray-400">Clips viraux</p>
        </div>
      </div>

      {/* Liste des clips */}
      <div className="space-y-3">
        {mockMyClips.map((clip, index) => (
          <motion.div
            key={clip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 rounded-lg bg-[#1a1f2c] p-3"
          >
            <div className="relative">
              <Image
                src={clip.thumbnail || "/placeholder.svg"}
                alt={clip.title}
                width={80}
                height={80}
                className="h-20 w-20 rounded object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                <Play className="h-4 w-4 text-white" />
              </div>

              {/* Platform badge */}
              <div className="absolute -top-1 -right-1">
                {clip.platform === "youtube" ? (
                  <div className="rounded-full bg-red-600 p-1">
                    <Youtube className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <div className="rounded-full bg-black p-1">
                    <Music2 className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Viral badge */}
              {clip.isViral && (
                <div className="absolute -bottom-1 -left-1 rounded bg-red-500 px-1 text-xs font-bold text-white">
                  🔥
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-white text-sm">{clip.title}</h3>
                <span className="text-xs text-gray-400">{clip.uploadDate}</span>
              </div>

              <p className="text-xs text-gray-500 mb-2">{clip.challenge}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-2">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{clip.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{clip.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{clip.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share className="h-3 w-3" />
                  <span>{clip.shares}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1" style={{ color: config.group.theme.primary }}>
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-semibold">+{clip.tokensEarned} tokens</span>
                </div>
                <button
                  className="text-xs text-gray-500 cursor-not-allowed flex items-center gap-1"
                  disabled
                >
                  <Clock className="h-3 w-3" />
                  Soon
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
