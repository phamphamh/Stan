"use client"

import { Camera, Trophy, CheckCircle, Clock, Target, RefreshCw, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion } from "framer-motion"
import { useMissions } from "@/hooks/useMissions"

export default function ActiveMissions() {
  const { missions: contractMissions, loading, error, refreshMissions } = useMissions()

  const handleMissionComplete = (missionIndex: number, missionName: string) => {
    // Pour l'instant, ne fait rien - sera implémenté plus tard
    console.log(`Mission ${missionIndex} (${missionName}) marquée comme complétée`)
    // TODO: Implémenter la logique de completion de mission
  }

  const getMissionStatusText = (status: string) => {
    switch (status) {
      case '1':
        return { text: 'Ouverte', color: 'text-green-400' }
      case '2':
        return { text: 'Fermée', color: 'text-red-400' }
      default:
        return { text: 'Inconnue', color: 'text-gray-400' }
    }
  }

  const getMissionIcon = (index: number) => {
    // Icônes alternées pour différencier visuellement les missions
    const icons = [Trophy, Target, Star, Camera]
    return icons[index % icons.length]
  }

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Active Missions</h2>
          <p className="text-gray-400">Complete missions to earn tokens and badges</p>
          <div className="flex justify-center mt-2">
            <Button
              onClick={refreshMissions}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Smart Contract Missions */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-white mb-2">Loading Missions</h3>
              <p className="text-gray-400">Fetching missions from smart contract...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Error Loading Missions</h3>
              <p className="text-gray-400">{error}</p>
              <Button
                onClick={refreshMissions}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Retry
              </Button>
            </div>
          ) : contractMissions.length > 0 ? (
            contractMissions.map((mission, index) => {
              const MissionIcon = getMissionIcon(mission.index)
              const statusInfo = getMissionStatusText(mission.status)
              const isOpen = mission.status === '1'

              return (
                <motion.div
                  key={mission.index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg p-4 border ${
                    isOpen 
                      ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30' 
                      : 'bg-gradient-to-r from-gray-900/20 to-gray-800/20 border-gray-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      isOpen 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      <MissionIcon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{mission.name}</h3>
                        <div className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
                          <div className={`h-2 w-2 rounded-full ${
                            isOpen ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          <span>{statusInfo.text}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 mb-3">{mission.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold" style={{ color: config.group.theme.primary }}>
                          +{mission.reward} Tokens
                        </span>

                        <Button
                          size="sm"
                          disabled={!isOpen}
                          onClick={() => handleMissionComplete(mission.index, mission.name)}
                          style={{
                            backgroundColor: !isOpen ? "#374151" : config.group.theme.primary,
                            color: "white",
                          }}
                        >
                          {!isOpen ? (
                            <>
                              <Clock className="mr-1 h-4 w-4" />
                              Fermée
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Complete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Missions Found</h3>
              <p className="text-gray-400">No missions available in the smart contract.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            🎯 Complete missions to earn tokens and unlock special badges!
          </p>
          {contractMissions.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              Missions chargées depuis le smart contract • {contractMissions.length} mission(s) trouvée(s)
            </p>
          )}
        </div>
      </div>
    </>
  )
}