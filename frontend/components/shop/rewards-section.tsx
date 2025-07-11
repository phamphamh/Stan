import { Gift } from "lucide-react"
import Image from "next/image"

const rewards = [
  {
    id: "1",
    name: "Daily Login Bonus",
    description: "Connexion quotidienne",
    points: 50,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "2",
    name: "Weekly Challenge",
    description: "Défi hebdomadaire",
    points: 200,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "3",
    name: "Stream Milestone",
    description: "1000 streams atteints",
    points: 500,
    image: "/placeholder.svg?height=60&width=60",
  },
]

export default function RewardsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Récompenses disponibles</h2>
      <div className="space-y-3">
        {rewards.map((reward) => (
          <div key={reward.id} className="flex items-center gap-4 rounded-lg bg-[#1a1f2c] p-3">
            <Image
              src={reward.image || "/placeholder.svg"}
              alt={reward.name}
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{reward.name}</h3>
              <p className="text-sm text-gray-400">{reward.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-purple-400">
                <Gift className="h-4 w-4" />
                <span className="font-bold">{reward.points}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
