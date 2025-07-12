"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Award, Star, Trophy, Medal, Crown, Sparkles } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface BadgeEarnedModalProps {
  isOpen: boolean
  onClose: () => void
  badge: {
    name: string
    description: string
    icon: any
    color: string
    rarity: "common" | "rare" | "epic" | "legendary"
  }
}

const rarityConfig = {
  common: {
    color: "#6b7280",
    backgroundColor: "#374151",
    sparkles: 3,
    title: "New Badge Earned!"
  },
  rare: {
    color: "#3b82f6",
    backgroundColor: "#1e40af",
    sparkles: 5,
    title: "Rare Badge Earned!"
  },
  epic: {
    color: "#8b5cf6",
    backgroundColor: "#7c3aed",
    sparkles: 7,
    title: "Epic Badge Earned!"
  },
  legendary: {
    color: "#f59e0b",
    backgroundColor: "#d97706",
    sparkles: 10,
    title: "Legendary Badge Earned!"
  }
}

export default function BadgeEarnedModal({ isOpen, onClose, badge }: BadgeEarnedModalProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isOpen && badge) {
      setShowAnimation(true)
      // Auto-close after 4 seconds
      const timeout = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, onClose, badge])

  // Vérifier si badge existe après tous les hooks
  if (!badge) {
    return null
  }

  const config = rarityConfig[badge.rarity]

  const sparklePositions = Array.from({ length: config.sparkles }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 0.1
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0a0f1b] border-gray-800 text-white">
        <div className="relative overflow-hidden rounded-lg p-6">
          {/* Animated background */}
          <div
            className="absolute inset-0 opacity-20 rounded-lg"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${config.color} 0%, transparent 70%)`
            }}
          />

          {/* Sparkles */}
          <AnimatePresence>
            {showAnimation && sparklePositions.map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: pos.x + "%", y: pos.y + "%" }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [pos.y + "%", (pos.y - 20) + "%"]
                }}
                transition={{
                  duration: 2,
                  delay: pos.delay,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute"
              >
                <Sparkles className="h-4 w-4" style={{ color: config.color }} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="flex justify-center"
            >
              <div
                className="p-6 rounded-full border-4"
                style={{
                  backgroundColor: config.backgroundColor,
                  borderColor: config.color
                }}
              >
                <badge.icon className="h-12 w-12" style={{ color: config.color }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-bold" style={{ color: config.color }}>
                {config.title}
              </h2>
              <h3 className="text-xl font-semibold text-white">{badge.name}</h3>
              <p className="text-gray-300">{badge.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Awesome! 🎉
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}