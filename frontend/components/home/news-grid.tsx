"use client"

import { config } from "@/lib/config"
import Image from "next/image"
import { Play, Heart, MessageCircle, Share } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const blackpinkNews = [
  {
    id: "1",
    title: "BLACKPINK 'Pink Venom' MV",
    description: "The official music video for Pink Venom",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Pink+Venom+MV",
    type: "video",
    duration: "3:13",
    likes: 12000,
    comments: 890,
  },
  {
    id: "2",
    title: "Jennie for Calvin Klein",
    description: "New exclusive photos from the campaign",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Jennie+CK",
    type: "photo",
    likes: 21000,
    comments: 1560,
  },
  {
    id: "3",
    title: "Lisa's 'LALISA' Solo Stage",
    description: "Iconic performance from the BORN PINK tour",
    imageUrl: "/placeholder.svg?height=200&width=300&text=LALISA+Stage",
    type: "video",
    duration: "3:02",
    likes: 18900,
    comments: 1170,
  },
]

export default function NewsGrid() {
  const news = blackpinkNews

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Actualités BLACKPINK</h2>
        <Link href="/news" className="text-sm" style={{ color: config.group.theme.primary }}>
          Voir tout
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg bg-[#1a1f2c]"
          >
            <div className="relative">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                width={300}
                height={200}
                className="h-48 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Type indicator */}
              <div className="absolute top-3 left-3">
                {item.type === "video" && (
                  <div className="flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-xs text-white">
                    <Play className="h-3 w-3" />
                    <span>{item.duration}</span>
                  </div>
                )}
                {item.type === "audio" && (
                  <div className="flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-xs text-white">
                    <Play className="h-3 w-3" />
                    <span>{item.duration}</span>
                  </div>
                )}
                {item.type === "photo" && <div className="rounded bg-black/50 px-2 py-1 text-xs text-white">Photo</div>}
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="mb-1 font-bold text-white">{item.title}</h3>
                <p className="mb-3 text-sm text-gray-300">{item.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{item.comments}</span>
                  </div>
                  <button className="ml-auto">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
