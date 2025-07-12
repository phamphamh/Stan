import { ShoppingCart, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import Image from "next/image"

const shopMissions = [
  {
    id: 1,
    title: "Buy the Official Lightstick Ver.2",
    description: "Get the official lightstick to support the group.",
    reward: 200,
    isCompleted: true,
    image: "/placeholder.svg?height=100&width=100&text=Lightstick",
  },
  {
    id: 2,
    title: "Join the 'BLINK' Fan Club",
    description: "Become an official member for exclusive benefits.",
    reward: 300,
    isCompleted: false,
    image: "/placeholder.svg?height=100&width=100&text=Membership",
  },
]

export default function ShopMission() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Shop Missions</h2>
      <p className="text-gray-400">Earn tokens by purchasing items from the store.</p>
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
              <h3 className="font-semibold text-white">{mission.title}</h3>
              <p className="text-xs text-gray-400 mb-2">{mission.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: config.group.theme.primary }}>
                  +{mission.reward} Tokens
                </span>
                <Button
                  size="sm"
                  disabled={mission.isCompleted}
                  style={{
                    backgroundColor: mission.isCompleted ? "#333" : config.group.theme.secondary,
                  }}
                >
                  {mission.isCompleted ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Done
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Buy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
