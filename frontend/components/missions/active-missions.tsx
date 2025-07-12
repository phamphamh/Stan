"use client"

import { Gift, Clock, CheckCircle, Target, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { useTokens } from "@/lib/tokens-context"
import ProofUploadModal from "@/components/modals/proof-upload-modal"

export default function ActiveMissions() {
  const { missions, completeMission } = useTokens()
  const [showProofModal, setShowProofModal] = useState(false)
  const [selectedMission, setSelectedMission] = useState<number | null>(null)

  const handleCompleteClick = (missionId: number) => {
    setSelectedMission(missionId)
    setShowProofModal(true)
  }

  const handleProofSubmit = () => {
    if (selectedMission) {
      completeMission(selectedMission)
    }
    setShowProofModal(false)
    setSelectedMission(null)
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Active Missions</h1>

        {/* Barre d'urgence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-600/20 border border-red-500 rounded-lg p-3 mb-4"
        >
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-semibold text-sm">
              THE MISSION WILL BE CLOSED IN 3 DAYS
            </span>
          </div>
        </motion.div>

        <p className="text-gray-400">Complete missions to win free BLACKPINK photocards</p>
      </div>

      <div className="space-y-4">
        {missions.map((mission, index) => {
          const isCompleted = mission.isCompleted

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-[#1a1f2c] rounded-lg p-4 ${isCompleted ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start gap-4">
                <Image
                  src="/placeholder.svg?height=80&width=80&text=Mission"
                  alt={mission.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{mission.title}</h3>
                    {!isCompleted && (
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>2 days left</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-3">{mission.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4" style={{ color: config.group.theme.primary }} />
                      <span className="text-sm font-medium" style={{ color: config.group.theme.primary }}>
                        {mission.reward} Tokens
                      </span>
                    </div>

                    <Button
                      size="sm"
                      disabled={isCompleted}
                      onClick={() => handleCompleteClick(mission.id)}
                      style={{
                        backgroundColor: isCompleted ? "#333" : config.group.theme.primary,
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
                          <Target className="mr-1 h-4 w-4" />
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

      <ProofUploadModal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        onSubmit={handleProofSubmit}
        missionTitle={selectedMission ? missions.find(m => m.id === selectedMission)?.title || "" : ""}
      />
    </div>
  )
}