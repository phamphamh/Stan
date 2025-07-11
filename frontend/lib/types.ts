// Type definitions for our data structures

export interface NewsItem {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  tag: string
}

export interface EventItem {
  id: string
  title: string
  description: string
  progress: number
  maxProgress: number
  reward: string
  endDate: string
}

export interface UserProgress {
  level: number
  xp: number
  nextLevelXp: number
  streak: number
  totalPoints: number
}

export interface LeaderboardEntry {
  id: string
  username: string
  avatar: string
  points: number
  rank: number
}

export interface Mission {
  id: string
  title: string
  description: string
  reward: string
  progress: number
  maxProgress: number
  type: "spotify" | "clipfarm" | "stream" | "buy" | "social"
}

export interface MediaItem {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  tag: string
  currentPage?: number
  totalPages?: number
}

export interface AtmosphereItem {
  id: string
  artist: string
  title: string
  date: string
  logoUrl: string
}
