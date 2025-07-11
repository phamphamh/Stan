import { ShoppingCart, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import Image from "next/image"

const shopMissions = [
  {
    id: 1,
    title: "Acheter le Lightstick Ver.2",
    description: "Obtenez le lightstick officiel pour supporter le groupe.",
    reward: 200,
    isCompleted: true,
    image: "/placeholder.svg?height=100&width=100&text=Lightstick",
  },
  {
    id: 2,
    title: "Rejoindre le Fan Club 'BLINK'",
    description: "Devenez un membre officiel pour des avantages exclusifs.",
    reward: 300,
    isCompleted: false,
    image: "/placeholder.svg?height=100&width=100&text=Membership",
  },
]

export default function ShopMission() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Missions d'Achat</h2>
      <p className="text-gray-400">Gagnez des tokens en achetant des articles dans la boutique.</p>
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
                      Fait
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Acheter
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
