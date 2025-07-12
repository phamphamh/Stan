"use client"

import { useBlockchain } from "@/lib/blockchain-context"
import { Button } from "@/components/ui/button"
import { Trophy, CheckCircle, Upload, Clock, Coins } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"

export function BlockchainMissions() {
  const { missions, isConnected, registerForMission, completeMission } = useBlockchain()
  const [loadingMission, setLoadingMission] = useState<number | null>(null)

  const handleRegisterForMission = async (missionId: number) => {
    if (!isConnected) {
      toast.error('Veuillez connecter votre wallet')
      return
    }

    setLoadingMission(missionId)
    try {
      await registerForMission(missionId)
      toast.success('Inscription à la mission réussie!')
    } catch (error) {
      console.error('Error registering for mission:', error)
      toast.error('Erreur lors de l\'inscription à la mission')
    } finally {
      setLoadingMission(null)
    }
  }

  const handleCompleteMission = async (missionId: number) => {
    if (!isConnected) {
      toast.error('Veuillez connecter votre wallet')
      return
    }

    setLoadingMission(missionId)
    try {
      await completeMission(missionId)
      toast.success('Mission complétée! Tokens BP reçus! 🎉')
    } catch (error) {
      console.error('Error completing mission:', error)
      toast.error('Erreur lors de la completion de la mission')
    } finally {
      setLoadingMission(null)
    }
  }

  const getMissionStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Non disponible'
      case 1: return 'Ouverte'
      case 2: return 'Fermée'
      default: return 'Inconnue'
    }
  }

  const getFanStatusText = (fanStatus: number) => {
    switch (fanStatus) {
      case 0: return 'Non inscrit'
      case 1: return 'Inscrit'
      case 2: return 'Complétée'
      default: return 'Inconnue'
    }
  }

  const getActionButton = (mission: any) => {
    const isLoading = loadingMission === mission.id

    if (mission.status === 2) {
      return (
        <Button disabled size="sm" className="bg-gray-600 text-gray-300">
          <Clock className="mr-1 h-4 w-4" />
          Mission fermée
        </Button>
      )
    }

    if (mission.fanStatus === 2) {
      return (
        <Button disabled size="sm" className="bg-green-600 text-white">
          <CheckCircle className="mr-1 h-4 w-4" />
          Complétée
        </Button>
      )
    }

    if (mission.fanStatus === 1) {
      return (
        <Button
          onClick={() => handleCompleteMission(mission.id)}
          disabled={isLoading}
          size="sm"
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1" />
              Completion...
            </>
          ) : (
            <>
              <Upload className="mr-1 h-4 w-4" />
              Compléter
            </>
          )}
        </Button>
      )
    }

    return (
      <Button
        onClick={() => handleRegisterForMission(mission.id)}
        disabled={isLoading}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1" />
            Inscription...
          </>
        ) : (
          <>
            <Trophy className="mr-1 h-4 w-4" />
            S'inscrire
          </>
        )}
      </Button>
    )
  }

  if (!isConnected) {
    return (
      <div className="space-y-4 p-4">
        <div className="text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-white mb-2">Missions BLACKPINK</h3>
          <p className="text-sm text-gray-400 mb-4">
            Connectez votre wallet pour voir et compléter les missions
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Missions Blockchain</h2>
        <p className="text-gray-400">Complétez des missions pour gagner des tokens BP</p>
      </div>

      <div className="grid gap-4">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg p-4 border bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                <Trophy className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{mission.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-400">
                    {getMissionStatusText(mission.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-3">{mission.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">
                        +{mission.reward} BP
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Statut: {getFanStatusText(mission.fanStatus)}
                    </span>
                  </div>

                  {getActionButton(mission)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {missions.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">Aucune mission disponible pour le moment</p>
        </div>
      )}

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          🎯 Les missions sont gérées par des contrats smart sur la blockchain Chiliz
        </p>
      </div>
    </div>
  )
}