"use client"

import { X, Settings, Edit, Share, Award, Calendar, Coins, LogOut } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { config } from "@/lib/config"
import Link from "next/link"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { group, user } = config
  const userBio = "BLINK depuis 2016 💖 Stan BLACKPINK forever"

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
              <h2 className="text-lg font-bold text-white">Mon Profil</h2>
              <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Profile Info */}
              <div className="text-center">
                <Image
                  src="/placeholder.svg?height=80&width=80&text=User"
                  alt="Profile"
                  width={80}
                  height={80}
                  className="mx-auto rounded-full"
                />
                <h2 className="mt-3 text-xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-400">
                  Niveau {user.level} • {group.displayName} Stan
                </p>
              </div>

              {/* Bio */}
              <div className="text-center">
                <p className="text-sm text-gray-300 leading-relaxed">{userBio}</p>
              </div>

              {/* Stats personnelles */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-yellow-400">
                    <Award className="h-5 w-5" />
                    <span className="text-xl font-bold">{user.level}</span>
                  </div>
                  <p className="text-sm text-gray-400">Niveau</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-orange-400">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xl font-bold">127</span>
                  </div>
                  <p className="text-sm text-gray-400">Jours actifs</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1" style={{ color: group.theme.primary }}>
                    <Coins className="h-5 w-5" />
                    <span className="text-xl font-bold">{user.tokens.toFixed(0)}</span>
                  </div>
                  <p className="text-sm text-gray-400">Tokens gagnés</p>
                </div>
              </div>

              {/* Badges et achievements */}
              <div className="rounded-lg bg-[#1a1f2c] p-4">
                <h3 className="mb-3 text-lg font-semibold text-white">Badges récents</h3>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: group.theme.primary + "30" }}
                    >
                      <Coins className="h-6 w-6" style={{ color: group.theme.primary }} />
                    </div>
                    <span className="text-xs text-gray-400">BLINK #1</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/30">
                      <Award className="h-6 w-6 text-yellow-400" />
                    </div>
                    <span className="text-xs text-gray-400">Top Streamer</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/30">
                      <Calendar className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-gray-400">Fidèle</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link href="/profile/edit" onClick={onClose}>
                  <Button className="w-full justify-start gap-3 bg-[#1a1f2c] text-white hover:bg-[#252b3a]">
                    <Edit className="h-4 w-4" />
                    Modifier le profil
                  </Button>
                </Link>
                <Button className="w-full justify-start gap-3 bg-[#1a1f2c] text-white hover:bg-[#252b3a]">
                  <Share className="h-4 w-4" />
                  Partager le profil
                </Button>
                <Button className="w-full justify-start gap-3 bg-[#1a1f2c] text-white hover:bg-[#252b3a]">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Button>
                <Button className="w-full justify-start gap-3 bg-red-600/20 text-red-400 hover:bg-red-600/30">
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
