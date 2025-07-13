'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const ARTIST_ABI = [
  "function getFanToken() public view returns(address)"
]

const TOKEN_ABI = [
  "function balanceOfEarnedToken(address account) public view returns(uint256)"
]

export function useTokenBalance() {
  console.log('🔵 Hook useTokenBalance initialisé')
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTokenBalance() {
      try {
        setLoading(true)
        setError(null)

        const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL
        const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARTIST_CONTRACT_ADDRESS?.replace(';', '')
        const FAN_ADDRESS = process.env.NEXT_PUBLIC_PROD_PUBLIC_KEY?.replace(';', '')

        if (!RPC_URL || !CONTRACT_ADDRESS || !FAN_ADDRESS) {
          throw new Error('Configuration manquante pour récupérer le balance')
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const artistContract = new ethers.Contract(CONTRACT_ADDRESS, ARTIST_ABI, provider)

        // Récupérer l'adresse du token
        const tokenAddress = await artistContract.getFanToken()
        console.log('Adresse du contrat artist:', CONTRACT_ADDRESS)
        console.log('Adresse du token récupérée:', tokenAddress)
        console.log('Adresse du fan:', FAN_ADDRESS)

        // Créer le contrat du token
        const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, provider)

        // Récupérer le balance du fan
        const fanBalance = await tokenContract.balanceOfEarnedToken(FAN_ADDRESS)
        const balanceString = fanBalance.toString()
        
        console.log('Balance brut du fan:', fanBalance)
        console.log('Balance formaté du fan:', balanceString)
        setBalance(balanceString)

      } catch (err: any) {
        console.error('Erreur lors de la récupération du balance:', err)
        setError(err.message || 'Erreur inconnue')
        setBalance('0')
      } finally {
        setLoading(false)
      }
    }

    // Écouter les missions complétées pour rafraîchir automatiquement
    const handleMissionCompleted = () => {
      fetchTokenBalance()
    }

    fetchTokenBalance()
    
    // Ajouter l'event listener
    window.addEventListener('missionCompleted', handleMissionCompleted)
    
    // Cleanup
    return () => {
      window.removeEventListener('missionCompleted', handleMissionCompleted)
    }
  }, [])

  const refreshBalance = async () => {
    setLoading(true)
    
    try {
      const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL
      const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARTIST_CONTRACT_ADDRESS?.replace(';', '')
      const FAN_ADDRESS = process.env.NEXT_PUBLIC_PROD_PUBLIC_KEY?.replace(';', '')

      if (!RPC_URL || !CONTRACT_ADDRESS || !FAN_ADDRESS) return

      const provider = new ethers.JsonRpcProvider(RPC_URL)
      const artistContract = new ethers.Contract(CONTRACT_ADDRESS, ARTIST_ABI, provider)

      const tokenAddress = await artistContract.getFanToken()
      const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, provider)

      const fanBalance = await tokenContract.balanceOfEarnedToken(FAN_ADDRESS)
      setBalance(fanBalance.toString())

    } catch (err: any) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return {
    balance,
    loading,
    error,
    refreshBalance
  }
}