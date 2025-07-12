import { ShoppingCart, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import Image from "next/image"

const shopMissions = [
  {
    id: 1,
    title: "Buy the Official Lightstick Ver.2",
    description: "Get the official BLACKPINK lightstick to support the group at concerts.",
    reward: 200,
    isCompleted: false,
    comingSoon: true,
    image: "/placeholder.svg?height=100&width=100&text=💡&bg=e91e63&color=white",
  },
  {
    id: 2,
    title: "Join the 'BLINK' Fan Club",
    description: "Become an official BLINK member for exclusive benefits and content.",
    reward: 300,
    isCompleted: false,
    comingSoon: true,
    image: "/placeholder.svg?height=100&width=100&text=👑&bg=8b5cf6&color=white",
  },
  {
    id: 3,
    title: "Purchase BORN PINK Album",
    description: "Support BLACKPINK by buying their latest album on any platform.",
    reward: 250,
    isCompleted: false,
    comingSoon: true,
    image: "/placeholder.svg?height=100&width=100&text=💿&bg=000000&color=white",
  },
  {
    id: 4,
    title: "Buy Official BLACKPINK Merch",
    description: "Purchase any official merchandise from the BLACKPINK store.",
    reward: 150,
    isCompleted: false,
    comingSoon: true,
    image: "/placeholder.svg?height=100&width=100&text=👕&bg=ff69b4&color=white",
  },
]

export default function ShopMission() {
  const handleMissionComplete = (missionId: number) => {
    // Simulate mission completion
    alert(`Mission ${missionId} completed! 🎉`)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Shop Missions</h2>
        <p className="text-gray-400">Earn tokens by purchasing official BLACKPINK items</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Clock className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-yellow-400">Coming Soon</span>
        </div>
      </div>

      <div className="space-y-3">
        {shopMissions.map((mission) => (
          <div key={mission.id} className="flex items-center gap-4 rounded-lg bg-[#1a1f2c] p-4">
            <Image
              src={mission.image || "/placeholder.svg"}
              alt={mission.title}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">{mission.title}</h3>
              </div>
              <p className="text-xs text-gray-400 mb-2">{mission.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: config.group.theme.primary }}>
                  +{mission.reward} Tokens
                </span>
                <Button
                  size="sm"
                  disabled={mission.comingSoon}
                  onClick={() => handleMissionComplete(mission.id)}
                  style={{
                    backgroundColor: mission.comingSoon ? "#374151" : config.group.theme.primary,
                    color: mission.comingSoon ? "#9CA3AF" : "white",
                  }}
                >
                  {mission.comingSoon ? (
                    <>
                      <Clock className="mr-1 h-4 w-4" />
                      Soon
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Complete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          🛍️ Complete shop missions to earn tokens and support BLACKPINK!
        </p>
      </div>
    </div>
  )
}
