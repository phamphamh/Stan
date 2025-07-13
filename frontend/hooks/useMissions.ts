'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export interface Mission {
  index: number
  name: string
  description: string
  reward: string
  status: string
}

const ARTIST_ABI = [
  "function getMissionName(uint256 nb_mission_) public view returns(string memory)",
  "function getMissionDescription(uint256 nb_mission_) public view returns(string memory)",
  "function getMissionStatus(uint256 nb_mission_) public view returns(uint8)",
  "function getMissionReward(uint256 nb_mission_) public view returns(uint256)"
]

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMissions() {
      try {
        setLoading(true)
        setError(null)

        // Configuration depuis les variables d'environnement
        const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL
        const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARTIST_CONTRACT_ADDRESS?.replace(';', '')

        if (!RPC_URL || !CONTRACT_ADDRESS) {
          throw new Error('Configuration manquante: RPC_URL ou CONTRACT_ADDRESS')
        }

        // Configuration du provider
        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ARTIST_ABI, provider)

        const foundMissions: Mission[] = []
        let missionIndex = 0

        // Boucle pour récupérer toutes les missions
        while (true) {
          try {
            const [missionName, missionDescription, missionStatus, missionReward] = await Promise.all([
              contract.getMissionName(missionIndex),
              contract.getMissionDescription(missionIndex),
              contract.getMissionStatus(missionIndex),
              contract.getMissionReward(missionIndex)
            ])

            foundMissions.push({
              index: missionIndex,
              name: missionName,
              description: missionDescription,
              reward: missionReward.toString(),
              status: missionStatus.toString()
            })

            missionIndex++
          } catch (error: any) {
            if (error.message.includes('MissionOutOfBand') || error.code === 'CALL_EXCEPTION') {
              // Plus de missions à récupérer
              break
            } else {
              console.error(`Erreur pour la mission ${missionIndex}:`, error.message)
              break
            }
          }
        }

        setMissions(foundMissions)
      } catch (err: any) {
        console.error('Erreur lors de la récupération des missions:', err)
        setError(err.message || 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchMissions()
  }, [])

  const refreshMissions = async () => {
    setLoading(true)
    // Re-trigger useEffect logic
    const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARTIST_CONTRACT_ADDRESS?.replace(';', '')

    if (!RPC_URL || !CONTRACT_ADDRESS) return

    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ARTIST_ABI, provider)

      const foundMissions: Mission[] = []
      let missionIndex = 0

      while (true) {
        try {
          const [missionName, missionDescription, missionStatus, missionReward] = await Promise.all([
            contract.getMissionName(missionIndex),
            contract.getMissionDescription(missionIndex),
            contract.getMissionStatus(missionIndex),
            contract.getMissionReward(missionIndex)
          ])

          foundMissions.push({
            index: missionIndex,
            name: missionName,
            description: missionDescription,
            reward: missionReward.toString(),
            status: missionStatus.toString()
          })

          missionIndex++
        } catch (error: any) {
          if (error.message.includes('MissionOutOfBand') || error.code === 'CALL_EXCEPTION') {
            break
          } else {
            console.error(`Erreur pour la mission ${missionIndex}:`, error.message)
            break
          }
        }
      }

      setMissions(foundMissions)
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return {
    missions,
    loading,
    error,
    refreshMissions
  }
}