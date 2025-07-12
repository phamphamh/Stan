"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface Mission {
  id: number
  title: string
  description: string
  reward: number
  isCompleted: boolean
  completedAt?: Date
}

interface TokensContextType {
  tokens: number
  addTokens: (amount: number) => void
  missions: Mission[]
  completeMission: (missionId: number) => void
  transactions: Array<{
    id: string
    type: string
    amount: number
    description: string
    timestamp: Date
  }>
  setTransactions: React.Dispatch<React.SetStateAction<Array<{
    id: string
    type: string
    amount: number
    description: string
    timestamp: Date
  }>>>
}

const TokensContext = createContext<TokensContextType | undefined>(undefined)

export function useTokens() {
  const context = useContext(TokensContext)
  if (!context) {
    throw new Error('useTokens must be used within a TokensProvider')
  }
  return context
}

export function TokensProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState(0)
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "Stream 'Pink Venom' 50 times",
      description: "Help us reach streaming goals",
      reward: 50,
      isCompleted: false,
    },
    {
      id: 2,
      title: "Complete 5 Daily Challenges",
      description: "Finish today's mission streak",
      reward: 30,
      isCompleted: false,
    },
    {
      id: 3,
      title: "Share 3 BLACKPINK Posts",
      description: "Spread the love across social media",
      reward: 20,
      isCompleted: false,
    },
  ])
  const [transactions, setTransactions] = useState<Array<{
    id: string
    type: string
    amount: number
    description: string
    timestamp: Date
  }>>([])

  // Load saved state from localStorage
  useEffect(() => {
    const savedTokens = localStorage.getItem('blackpink-tokens')
    const savedMissions = localStorage.getItem('blackpink-missions')
    const savedTransactions = localStorage.getItem('blackpink-transactions')

    if (savedTokens) setTokens(parseInt(savedTokens))
    if (savedMissions) {
      const missions = JSON.parse(savedMissions)
      // Convert completedAt back to Date object
      missions.forEach((mission: any) => {
        if (mission.completedAt) {
          mission.completedAt = new Date(mission.completedAt)
        }
      })
      setMissions(missions)
    }
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions)
      // Convert timestamp back to Date object
      transactions.forEach((transaction: any) => {
        transaction.timestamp = new Date(transaction.timestamp)
      })
      setTransactions(transactions)
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('blackpink-tokens', tokens.toString())
  }, [tokens])

  useEffect(() => {
    localStorage.setItem('blackpink-missions', JSON.stringify(missions))
  }, [missions])

  useEffect(() => {
    localStorage.setItem('blackpink-transactions', JSON.stringify(transactions))
  }, [transactions])

  const addTokens = (amount: number) => {
    setTokens(prev => prev + amount)
  }

  const completeMission = (missionId: number) => {
    setMissions(prev =>
      prev.map(mission =>
        mission.id === missionId
          ? { ...mission, isCompleted: true, completedAt: new Date() }
          : mission
      )
    )

    const mission = missions.find(m => m.id === missionId)
    if (mission && !mission.isCompleted) {
      addTokens(mission.reward)

      // Add transaction
      const newTransaction = {
        id: Date.now().toString(),
        type: "Mission",
        amount: mission.reward,
        description: `Completed: ${mission.title}`,
        timestamp: new Date(),
      }
      setTransactions(prev => [newTransaction, ...prev])
    }
  }

  return (
    <TokensContext.Provider value={{
      tokens,
      addTokens,
      missions,
      completeMission,
      transactions,
      setTransactions,
    }}>
      {children}
    </TokensContext.Provider>
  )
}