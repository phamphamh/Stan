"use client"

import { config } from "@/lib/config"
import Image from "next/image"
import { Play, Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"

// Mock avatars pour le feed
const mockAvatars = [
  "/placeholder.svg?height=32&width=32&text=BP&bg=e91e63&color=white",
  "/placeholder.svg?height=32&width=32&text=YG&bg=000000&color=white",
  "/placeholder.svg?height=32&width=32&text=🖤&bg=ff69b4&color=white",
  "/placeholder.svg?height=32&width=32&text=💗&bg=000000&color=white",
]

const blackpinkNews = [
  {
    id: "1",
    title: "BLACKPINK Official Update",
    description: "Behind the scenes from our latest photoshoot ✨",
    imageUrl: "/images/jennie_feed.jpg",
    type: "photo",
    likes: 45000,
    comments: 2890,
    username: "officialbp",
    userAvatar: mockAvatars[0],
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Lisa Solo Performance",
    description: "Exclusive moments from the BORN PINK tour 🖤💗",
    imageUrl: "/images/lisa_feed.jpg",
    type: "photo",
    likes: 52000,
    comments: 3450,
    username: "officialbp",
    userAvatar: mockAvatars[1],
    timestamp: "1 day ago",
  },
  {
    id: "3",
    title: "Rosé Studio Session",
    description: "Working on something special for BLINKS 🌹",
    imageUrl: "/images/rosé_feed.jpg",
    type: "photo",
    likes: 38000,
    comments: 1890,
    username: "officialbp",
    userAvatar: mockAvatars[2],
    timestamp: "3 days ago",
  },
  {
    id: "4",
    title: "Jisoo's Latest Look",
    description: "Serving looks as always 💜 What's your favorite outfit?",
    imageUrl: "/images/jisoo_feed.png",
    type: "photo",
    likes: 41000,
    comments: 2150,
    username: "officialbp",
    userAvatar: mockAvatars[3],
    timestamp: "5 days ago",
  },
]

export default function NewsGrid() {
  const news = blackpinkNews

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">BLACKPINK Feed</h2>
      </div>

      <div className="space-y-6">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1a1f2c] rounded-lg overflow-hidden"
          >
            {/* Instagram-style header */}
            <div className="flex items-center justify-between p-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={item.userAvatar}
                    alt={item.username}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-pink-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1f2c]"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{item.username}</h3>
                  <p className="text-gray-400 text-xs">{item.timestamp}</p>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </div>

            {/* Image */}
            <div className="relative">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                width={400}
                height={400}
                className="w-full h-96 object-cover"
              />

              {/* Type indicator */}
              {item.type === "video" && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-xs text-white">
                    <Play className="h-3 w-3" />
                    <span>{item.duration}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Instagram-style actions */}
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <Heart className="h-6 w-6 text-white hover:text-red-500 cursor-pointer transition-colors" />
                <MessageCircle className="h-6 w-6 text-white hover:text-blue-500 cursor-pointer transition-colors" />
                <Share className="h-6 w-6 text-white hover:text-green-500 cursor-pointer transition-colors" />
              </div>

              <div className="mb-2">
                <span className="text-white font-semibold text-sm">{item.likes.toLocaleString()} likes</span>
              </div>

              <div className="mb-2">
                <span className="text-white font-semibold text-sm">{item.username}</span>
                <span className="text-white text-sm ml-2">{item.description}</span>
              </div>

              <div className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                View all {item.comments.toLocaleString()} comments
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
