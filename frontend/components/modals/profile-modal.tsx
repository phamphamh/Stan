"use client"

import { X, Settings, Edit, Share, Award, Calendar, Coins, LogOut } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { config } from "@/lib/config"
import Link from "next/link"
import { useTokens } from "@/lib/tokens-context"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { tokens, level, earnedBadges } = useTokens()
  const userBio = "BLACKPINK forever 💖 Stan since 2016"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-20 bottom-20 z-50 mx-auto max-w-md rounded-lg bg-[#0a0f1b] border border-gray-800 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 p-4 sticky top-0 bg-[#0a0f1b]/80 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white">Profile</h2>
              <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Image
                    src="/placeholder.svg?height=80&width=80&text=User&bg=e91e63&color=white"
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full mx-auto border-4 border-pink-500"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0a0f1b]"
                    style={{ backgroundColor: config.group.theme.primary }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">BLINK_Fan_01</h3>
                  <p className="text-gray-400">Level {level} • BLACKPINK Stan</p>
                </div>
                <p className="text-sm text-gray-300">{userBio}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1f2c] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2" style={{ color: config.group.theme.primary }}>
                    <Award className="h-5 w-5" />
                    <span className="text-xl font-bold">{level}</span>
                  </div>
                  <p className="text-sm text-gray-400">Level</p>
                </div>
                <div className="bg-[#1a1f2c] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2" style={{ color: config.group.theme.primary }}>
                    <Coins className="h-5 w-5" />
                    <span className="text-xl font-bold">{tokens}</span>
                  </div>
                  <p className="text-sm text-gray-400">Tokens Earned</p>
                </div>
              </div>

              {/* Badges */}
              <div className="bg-[#1a1f2c] rounded-lg p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Recent Badges</h4>
                {earnedBadges.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {earnedBadges.slice(0, 3).map((badge, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full border"
                          style={{
                            backgroundColor: badge.color + "20",
                            borderColor: badge.color
                          }}
                        >
                          <badge.icon className="h-5 w-5" style={{ color: badge.color }} />
                        </div>
                        <span className="text-xs text-center text-gray-400">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No badges earned yet</p>
                )}
              </div>

              {/* Member Since */}
              <div className="bg-[#1a1f2c] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Member Since</p>
                    <p className="text-xs text-gray-400">March 2022</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link href="/profile/edit" onClick={onClose}>
                  <Button className="w-full justify-start gap-3 bg-[#1a1f2c] text-white hover:bg-[#252b3a]">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
