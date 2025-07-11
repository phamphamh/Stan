"use client"
import Image from "next/image"
import { Play, Heart, MessageCircle, Share, Clock } from "lucide-react"
import { motion } from "framer-motion"

const allBlackpinkNews = [
  {
    id: "1",
    title: "BLACKPINK 'Pink Venom' MV",
    description: "The official music video for Pink Venom",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Pink+Venom+MV",
    type: "video",
    duration: "3:13",
    likes: 12000,
    comments: 890,
    timestamp: "2h",
  },
  {
    id: "2",
    title: "Jennie for Calvin Klein",
    description: "New exclusive photos from the campaign",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Jennie+CK",
    type: "photo",
    likes: 21000,
    comments: 1560,
    timestamp: "4h",
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
    timestamp: "6h",
  },
  {
    id: "4",
    title: "Rosé's 'On The Ground' Behind the Scenes",
    description: "Exclusive footage from the music video shoot",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Rose+BTS",
    type: "video",
    duration: "5:45",
    likes: 15600,
    comments: 980,
    timestamp: "8h",
  },
  {
    id: "5",
    title: "Jisoo's Acting Debut Update",
    description: "Latest news from her upcoming drama series",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Jisoo+Drama",
    type: "article",
    likes: 9800,
    comments: 567,
    timestamp: "12h",
  },
  {
    id: "6",
    title: "BORN PINK World Tour Highlights",
    description: "Best moments from the global tour",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Tour+Highlights",
    type: "video",
    duration: "8:20",
    likes: 25400,
    comments: 2100,
    timestamp: "1j",
  },
  {
    id: "7",
    title: "BLACKPINK x Spotify Wrapped",
    description: "Most streamed K-pop group of the year",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Spotify+Wrapped",
    type: "article",
    likes: 13200,
    comments: 890,
    timestamp: "1j",
  },
  {
    id: "8",
    title: "Lisa's Dance Practice Session",
    description: "Exclusive choreography rehearsal footage",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Lisa+Dance",
    type: "video",
    duration: "4:15",
    likes: 19800,
    comments: 1340,
    timestamp: "2j",
  },
]

export default function NewsFullGrid() {
  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">Toutes les actualités • {allBlackpinkNews.length} articles</p>

      <div className="grid grid-cols-1 gap-4">
        {allBlackpinkNews.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
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
                {item.type === "article" && (
                  <div className="rounded bg-black/50 px-2 py-1 text-xs text-white">Article</div>
                )}
                {item.type === "photo" && <div className="rounded bg-black/50 px-2 py-1 text-xs text-white">Photo</div>}
              </div>

              {/* Timestamp */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-xs text-white">
                  <Clock className="h-3 w-3" />
                  <span>{item.timestamp}</span>
                </div>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="mb-1 font-bold text-white">{item.title}</h3>
                <p className="mb-3 text-sm text-gray-300">{item.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{item.likes.toLocaleString()}</span>
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
