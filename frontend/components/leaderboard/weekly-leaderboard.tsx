import { Trophy, Medal, Award } from "lucide-react"
import Image from "next/image"

const mockLeaderboard = [
  { id: "1", username: "OrbitalFan", avatar: "/placeholder.svg?height=40&width=40", points: 15680, rank: 1 },
  { id: "2", username: "LunarOrbit", avatar: "/placeholder.svg?height=40&width=40", points: 14250, rank: 2 },
  { id: "3", username: "StarGazer", avatar: "/placeholder.svg?height=40&width=40", points: 13890, rank: 3 },
  { id: "4", username: "CosmicDream", avatar: "/placeholder.svg?height=40&width=40", points: 12450, rank: 4 },
  { id: "5", username: "GalaxyHeart", avatar: "/placeholder.svg?height=40&width=40", points: 11200, rank: 5 },
]

export default function WeeklyLeaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Classement de la semaine</h2>
      <div className="space-y-3">
        {mockLeaderboard.map((user) => (
          <div key={user.id} className="flex items-center gap-4 rounded-lg bg-[#1a1f2c] p-3">
            <div className="flex w-8 justify-center">{getRankIcon(user.rank)}</div>
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.username}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">{user.username}</p>
              <p className="text-sm text-gray-400">{user.points.toLocaleString()} points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
