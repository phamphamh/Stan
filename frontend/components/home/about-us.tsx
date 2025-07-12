"use client"

import { Heart, Music, Users } from "lucide-react"
import { motion } from "framer-motion"
import { config } from "@/lib/config"

export default function AboutUs() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">About Us</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg bg-[#1a1f2c] p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: config.group.theme.primary }}>
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">BLACKPINK Fans Initiative</h3>
        </div>

        <p className="text-gray-300 mb-4 leading-relaxed">
          We are passionate BLACKPINK fans who created this initiative to reward BLINKs for streaming their latest single.
          Our goal is to unite the fandom and celebrate our love for BLACKPINK by giving back to the community.
        </p>

        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Stream Support</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Fan Community</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Made with Love</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}