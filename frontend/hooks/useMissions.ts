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
  "function getMissionReward(uint256 nb_mission_) public view returns(uint256)",
  "function completeFanMission(uint256 missionIndex, address fan) public",
  "function registerFanOnMission(uint256 missionIndex, address fan) public",
  "function getStatuFanOnMission(uint256 missionIndex, address fan) public view returns(uint8)"
]

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(new Set())
  const [completingMissions, setCompletingMissions] = useState<Set<number>>(new Set())
  const [registeredMissions, setRegisteredMissions] = useState<Set<number>>(new Set())
  const [registeringMissions, setRegisteringMissions] = useState<Set<number>>(new Set())
  const [fanMissionStatuses, setFanMissionStatuses] = useState<Map<number, string>>(new Map())

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

  const completeMission = async (missionIndex: number) => {
    try {
      setCompletingMissions(prev => new Set(prev).add(missionIndex))
      
      const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL
      const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARTIST_CONTRACT_ADDRESS?.replace(';', '')
      const FAN_ADDRESS = process.env.NEXT_PUBLIC_PROD_PUBLIC_KEY?.replace(';', '')
      const PRIVATE_KEY = process.env.NEXT_PUBLIC_PROD_PRIVATE_KEY?.replace(';', '')

      if (!RPC_URL || !CONTRACT_ADDRESS || !FAN_ADDRESS || !PRIVATE_KEY) {
        throw new Error('Configuration manquante pour compléter la mission')
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL)
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ARTIST_ABI, wallet)

      // Vérifier le statut du fan avant de tenter la completion
      const fanStatus = await contract.getStatuFanOnMission(missionIndex, FAN_ADDRESS)
      console.log(`Statut du fan avant completion de la mission ${missionIndex}:`, fanStatus.toString())

      const tx = await contract.completeFanMission(missionIndex, FAN_ADDRESS)
      await tx.wait()

      setCompletedMissions(prev => new Set(prev).add(missionIndex))
      setCompletingMissions(prev => {
        const newSet = new Set(prev)
        newSet.delete(missionIndex)
        return newSet
      })

      return { success: true }
    } catch (error: any) {
      setCompletingMissions(prev => {
        const newSet = new Set(prev)
        newSet.delete(missionIndex)
        return newSet
      })
      console.error('Erreur lors de la completion de la mission:', error)
      return { success: false, error: error.message }
    }
  }

  const registerMission = async (missionIndex: number) => {
    try {
      setRegisteringMissions(prev => new Set(prev).add(missionIndex))
      
      const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL
      const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARTIST_CONTRACT_ADDRESS?.replace(';', '')
      const FAN_ADDRESS = process.env.NEXT_PUBLIC_PROD_PUBLIC_KEY?.replace(';', '')
      const PRIVATE_KEY = process.env.NEXT_PUBLIC_PROD_PRIVATE_KEY?.replace(';', '')

      if (!RPC_URL || !CONTRACT_ADDRESS || !FAN_ADDRESS || !PRIVATE_KEY) {
        throw new Error('Configuration manquante pour s\'inscrire à la mission')
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL)
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ARTIST_ABI, wallet)

      const tx = await contract.registerFanOnMission(missionIndex, FAN_ADDRESS)
      await tx.wait()

      // Vérifier le statut après inscription
      const fanStatus = await contract.getStatuFanOnMission(missionIndex, FAN_ADDRESS)
      console.log(`Statut du fan après inscription à la mission ${missionIndex}:`, fanStatus.toString())

      setRegisteredMissions(prev => new Set(prev).add(missionIndex))
      setRegisteringMissions(prev => {
        const newSet = new Set(prev)
        newSet.delete(missionIndex)
        return newSet
      })

      return { success: true }
    } catch (error: any) {
      setRegisteringMissions(prev => {
        const newSet = new Set(prev)
        newSet.delete(missionIndex)
        return newSet
      })
      console.error('Erreur lors de l\'inscription à la mission:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    missions,
    loading,
    error,
    refreshMissions,
    completeMission,
    completedMissions,
    completingMissions,
    registerMission,
    registeredMissions,
    registeringMissions
  }
}