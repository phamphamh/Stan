"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Award, Star, Trophy, Medal, Crown, Sparkles } from "lucide-react"

interface Mission {
  id: string
  title: string
  description: string
  reward: number
  isCompleted: boolean
  type: "content" | "stream" | "shop"
  badgeReward?: {
    name: string
    description: string
    icon: any
    color: string
    rarity: "common" | "rare" | "epic" | "legendary"
  }
}

interface UserBadge {
  id: string
  name: string
  description: string
  icon: any
  color: string
  rarity: "common" | "rare" | "epic" | "legendary"
  earnedAt: string
}

interface Transaction {
  id: string
  type: "Mission" | "Lottery" | "Purchase"
  description: string
  amount: number
  timestamp: Date
}

interface TokensContextType {
  tokens: number
  level: number
  xp: number
  xpToNextLevel: number
  missions: Mission[]
  earnedBadges: UserBadge[]
  transactions: Transaction[]
  addTokens: (amount: number) => void
  completeMission: (missionId: string) => Promise<{ newBadge?: UserBadge; levelUp?: boolean }>
  resetTokens: () => void
  addBadge: (badge: UserBadge) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
}

const TokensContext = createContext<TokensContextType | undefined>(undefined)

const availableBadges = [
  {
    id: "first-mission",
    name: "First Steps",
    description: "Complete your first mission!",
    icon: Star,
    color: "#3b82f6",
    rarity: "common" as const
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "Complete 5 content missions",
    icon: Trophy,
    color: "#8b5cf6",
    rarity: "epic" as const
  },
  {
    id: "stream-master",
    name: "Stream Master",
    description: "Complete 10 stream missions",
    icon: Award,
    color: "#f59e0b",
    rarity: "legendary" as const
  },
  {
    id: "shopaholic",
    name: "Shopaholic",
    description: "Complete 3 shop missions",
    icon: Medal,
    color: "#10b981",
    rarity: "rare" as const
  },
  {
    id: "blink-legend",
    name: "BLINK Legend",
    description: "Reach level 10",
    icon: Crown,
    color: "#e91e63",
    rarity: "legendary" as const
  }
]

export function TokensProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState(0)
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [missions, setMissions] = useState<Mission[]>([])

  // Calculate XP needed for next level (exponential growth)
  const xpToNextLevel = level * 200

  // Load data from localStorage on mount
  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return

    const savedTokens = localStorage.getItem('blackpink-tokens')
    const savedLevel = localStorage.getItem('blackpink-level')
    const savedXp = localStorage.getItem('blackpink-xp')
    const savedMissions = localStorage.getItem('blackpink-missions')
    const savedBadges = localStorage.getItem('blackpink-badges')
    const savedTransactions = localStorage.getItem('blackpink-transactions')

    if (savedTokens) setTokens(parseInt(savedTokens))
    if (savedLevel) setLevel(parseInt(savedLevel))
    if (savedXp) setXp(parseInt(savedXp))
    if (savedMissions) setMissions(JSON.parse(savedMissions))
    if (savedBadges) {
      const badges = JSON.parse(savedBadges)
      // Restore icon components
      const restoredBadges = badges.map((badge: any) => ({
        ...badge,
        icon: availableBadges.find(b => b.id === badge.id)?.icon || Star
      }))
      setEarnedBadges(restoredBadges)
    }
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions)
      // Restore Date objects
      const restoredTransactions = transactions.map((transaction: any) => ({
        ...transaction,
        timestamp: new Date(transaction.timestamp)
      }))
      setTransactions(restoredTransactions)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return

    localStorage.setItem('blackpink-tokens', tokens.toString())
    localStorage.setItem('blackpink-level', level.toString())
    localStorage.setItem('blackpink-xp', xp.toString())
    localStorage.setItem('blackpink-missions', JSON.stringify(missions))
    localStorage.setItem('blackpink-badges', JSON.stringify(earnedBadges))
    localStorage.setItem('blackpink-transactions', JSON.stringify(transactions))
  }, [tokens, level, xp, missions, earnedBadges, transactions])

  const addTokens = (amount: number) => {
    setTokens(prev => prev + amount)
  }

  const addBadge = (badge: UserBadge) => {
    setEarnedBadges(prev => [...prev, badge])
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const checkForNewBadges = (updatedMissions: Mission[]) => {
    const completedMissions = updatedMissions.filter(m => m.isCompleted)
    const contentMissions = completedMissions.filter(m => m.type === "content").length
    const streamMissions = completedMissions.filter(m => m.type === "stream").length
    const shopMissions = completedMissions.filter(m => m.type === "shop").length

    const newBadges: UserBadge[] = []

    // Check for various badge conditions
    if (completedMissions.length === 1 && !earnedBadges.some(b => b.id === "first-mission")) {
      const badgeTemplate = availableBadges.find(b => b.id === "first-mission")!
      newBadges.push({
        ...badgeTemplate,
        earnedAt: new Date().toISOString()
      })
    }

    if (contentMissions >= 5 && !earnedBadges.some(b => b.id === "content-creator")) {
      const badgeTemplate = availableBadges.find(b => b.id === "content-creator")!
      newBadges.push({
        ...badgeTemplate,
        earnedAt: new Date().toISOString()
      })
    }

    if (streamMissions >= 10 && !earnedBadges.some(b => b.id === "stream-master")) {
      const badgeTemplate = availableBadges.find(b => b.id === "stream-master")!
      newBadges.push({
        ...badgeTemplate,
        earnedAt: new Date().toISOString()
      })
    }

    if (shopMissions >= 3 && !earnedBadges.some(b => b.id === "shopaholic")) {
      const badgeTemplate = availableBadges.find(b => b.id === "shopaholic")!
      newBadges.push({
        ...badgeTemplate,
        earnedAt: new Date().toISOString()
      })
    }

    if (level >= 10 && !earnedBadges.some(b => b.id === "blink-legend")) {
      const badgeTemplate = availableBadges.find(b => b.id === "blink-legend")!
      newBadges.push({
        ...badgeTemplate,
        earnedAt: new Date().toISOString()
      })
    }

    return newBadges
  }

  const completeMission = async (missionId: string): Promise<{ newBadge?: UserBadge; levelUp?: boolean }> => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission || mission.isCompleted) return {}

    // Update mission as completed
    const updatedMissions = missions.map(m =>
      m.id === missionId ? { ...m, isCompleted: true } : m
    )
    setMissions(updatedMissions)

    // Add tokens and XP
    const newTokens = tokens + mission.reward
    const newXp = xp + mission.reward

    setTokens(newTokens)
    setXp(newXp)

    // Add transaction
    addTransaction({
      type: "Mission",
      description: mission.title,
      amount: mission.reward,
      timestamp: new Date()
    })

    // Check for level up
    let levelUp = false
    if (newXp >= xpToNextLevel) {
      setLevel(prev => prev + 1)
      setXp(0)
      levelUp = true
    }

    // Check for new badges
    const newBadges = checkForNewBadges(updatedMissions)
    if (newBadges.length > 0) {
      setEarnedBadges(prev => [...prev, ...newBadges])
      return { newBadge: newBadges[0], levelUp }
    }

    return { levelUp }
  }

  const resetTokens = () => {
    setTokens(0)
    setLevel(1)
    setXp(0)
    setEarnedBadges([])
    setMissions(missions.map(m => ({ ...m, isCompleted: false })))
    setTransactions([]) // Clear transactions on reset
    
    // Vérifier que nous sommes côté client
    if (typeof window !== 'undefined') {
      localStorage.removeItem('blackpink-tokens')
      localStorage.removeItem('blackpink-level')
      localStorage.removeItem('blackpink-xp')
      localStorage.removeItem('blackpink-missions')
      localStorage.removeItem('blackpink-badges')
      localStorage.removeItem('blackpink-transactions')
    }
  }

  return (
    <TokensContext.Provider value={{
      tokens,
      level,
      xp,
      xpToNextLevel,
      missions,
      earnedBadges,
      transactions,
      addTokens,
      completeMission,
      resetTokens,
      addBadge,
      addTransaction
    }}>
      {children}
    </TokensContext.Provider>
  )
}

export function useTokens() {
  const context = useContext(TokensContext)
  if (context === undefined) {
    throw new Error("useTokens must be used within a TokensProvider")
  }
  return context
}