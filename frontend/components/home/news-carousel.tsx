"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const blackpinkNews = [
  {
    id: "1",
    title: "BORN PINK World Tour Finale",
    subtitle: "Official Announcement",
    imageUrl: "/placeholder.svg?height=450&width=800&text=BORN+PINK+Tour",
    tag: "Tour",
  },
  {
    id: "2",
    title: "'Pink Venom' MV Reaches 1B Views",
    subtitle: "New Milestone Achieved",
    imageUrl: "/placeholder.svg?height=450&width=800&text=Pink+Venom+1B",
    tag: "Milestone",
  },
  {
    id: "3",
    title: "JISOO 'FLOWER' Dance Practice",
    subtitle: "Behind the Scenes",
    imageUrl: "/placeholder.svg?height=450&width=800&text=JISOO+FLOWER",
    tag: "Exclusive",
  },
]

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % blackpinkNews.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + blackpinkNews.length) % blackpinkNews.length)
  }

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="relative h-full w-full"
        >
          <Image
            src={blackpinkNews[currentIndex].imageUrl || "/placeholder.svg"}
            alt={blackpinkNews[currentIndex].title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <span className="mb-2 inline-block rounded bg-black/50 px-2 py-0.5 text-xs font-semibold">
              {blackpinkNews[currentIndex].tag}
            </span>
            <h3 className="text-xl font-bold">{blackpinkNews[currentIndex].title}</h3>
            <p className="text-sm text-gray-300">{blackpinkNews[currentIndex].subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {blackpinkNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
