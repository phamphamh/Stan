"use client"

import { useState } from "react"
import { Camera, Trophy, CheckCircle, Upload, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion, AnimatePresence } from "framer-motion"
import { useTokens } from "@/lib/tokens-context"
import { useCompleteMission } from "@/lib/contracts/artist"
import { MISSION_MAPPING } from "@/lib/constants"
import { useAccount } from "wagmi"
import ProofUploadModal from "@/components/modals/proof-upload-modal"
import BadgeEarnedModal from "@/components/modals/badge-earned-modal"

const activeMissions = [
  {
    id: "stream-mission",
    title: "Stream BLACKPINK Songs",
    description: "Listen to your favorite BLACKPINK songs and show your support",
    reward: 75,
    type: "stream" as const,
    icon: Trophy,
    requiresProof: true,
    isSpecial: false,
  },
  {
    id: "content-mission",
    title: "Create BLACKPINK Content",
    description: "Share your BLACKPINK love by creating content (TikTok, Instagram, etc.)",
    reward: 100,
    type: "content" as const,
    icon: Camera,
    requiresProof: true,
    isSpecial: false,
  },
  {
    id: "tweet-mission",
    title: "Tweet About BLACKPINK",
    description: "Share your love for BLACKPINK on Twitter/X and show your support",
    reward: 100,
    type: "content" as const,
    icon: Star,
    requiresProof: true,
    isSpecial: false,
  },
]

const photocardMission = {
  id: "photocard-mission",
  title: "Collect Your First Photocard",
  description: "Purchase the exclusive BLACKPINK photocard to start your collection",
  reward: 150,
  type: "reward" as const,
  icon: Star,
  requiresProof: false,
  isSpecial: true,
}

export default function ActiveMissions() {
  const { tokens, completeMission, missions } = useTokens()
  const { completeMission: completeMissionBlockchain, isLoading: isCompleting } = useCompleteMission()
  const { isConnected } = useAccount()
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedMission, setSelectedMission] = useState<string | null>(null)
  const [badgeModalOpen, setBadgeModalOpen] = useState(false)
  const [earnedBadge, setEarnedBadge] = useState<any>(null)

  const handleMissionComplete = (missionId: string, requiresProof: boolean) => {
    if (requiresProof) {
      setSelectedMission(missionId)
      setUploadModalOpen(true)
    } else {
      completeMissionDirect(missionId)
    }
  }

  const completeMissionDirect = async (missionId: string) => {
    // Si connecté à la blockchain, utiliser le smart contract
    if (isConnected && missionId in MISSION_MAPPING) {
      const blockchainId = MISSION_MAPPING[missionId as keyof typeof MISSION_MAPPING]
      completeMissionBlockchain(blockchainId)
    } else {
      // Sinon, utiliser l'ancien système de tokens mocké
      const result = await completeMission(missionId)

      if (result.newBadge) {
        setEarnedBadge(result.newBadge)
        setBadgeModalOpen(true)
      }

      if (result.levelUp) {
        // Show level up notification
        setTimeout(() => {
          alert("🎉 Level Up! You reached a new level!")
        }, 1000)
      }
    }
  }

  const handleProofSubmitted = async (missionId: string) => {
    setUploadModalOpen(false)
    setSelectedMission(null)
    completeMissionDirect(missionId)
  }

  const isMissionCompleted = (missionId: string) => {
    return missions.some(m => m.id === missionId && m.isCompleted)
  }

  const isPhotocardCompleted = isMissionCompleted(photocardMission.id)

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Active Missions</h2>
          <p className="text-gray-400">Complete missions to earn tokens and badges</p>
        </div>

        {/* Special Photocard Mission Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-pink-600/20 border border-pink-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <h3 className="text-base font-bold text-white">Complete missions below and go get exclusive photocard</h3>
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <Button
              size="sm"
              disabled={isPhotocardCompleted}
              onClick={() => window.location.href = "/reward"}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              {isPhotocardCompleted ? (
                <>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Completed
                </>
              ) : (
                "Get Photocard"
              )}
            </Button>
          </div>
        </motion.div>

        {/* Regular Missions */}
        <div className="grid gap-4">
          {activeMissions.map((mission, index) => {
            const isCompleted = isMissionCompleted(mission.id)

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg p-4 border bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                    <mission.icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{mission.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <Star className="h-3 w-3" />
                        <span>Special</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">{mission.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: config.group.theme.primary }}>
                        +{mission.reward} Tokens
                      </span>

                      <Button
                        size="sm"
                        disabled={isCompleted}
                        onClick={() => handleMissionComplete(mission.id, mission.requiresProof)}
                        style={{
                          backgroundColor: isCompleted ? "#374151" : config.group.theme.primary,
                          color: "white",
                        }}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Upload className="mr-1 h-4 w-4" />
                            Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            🎯 Complete missions to earn tokens and unlock special badges!
          </p>
        </div>
      </div>

      <ProofUploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false)
          setSelectedMission(null)
        }}
        onSubmit={() => selectedMission && handleProofSubmitted(selectedMission)}
        missionTitle={selectedMission ? activeMissions.find(m => m.id === selectedMission)?.title || "" : ""}
      />

      <BadgeEarnedModal
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
        badge={earnedBadge}
      />
    </>
  )
}