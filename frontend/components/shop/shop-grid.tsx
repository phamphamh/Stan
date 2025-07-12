import { ShoppingCart, Star, Lock } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"

const shopItems = [
  {
    id: "1",
    name: "BORN PINK Album (Digipack)",
    price: "24.99€",
    image: "/placeholder.svg?height=200&width=200&text=Born+Pink+Album",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Official Lightstick Ver.2",
    price: "55.00€",
    image: "/placeholder.svg?height=200&width=200&text=Lightstick",
    rating: 5.0,
  },
  {
    id: "3",
    name: "BLINK Fan Membership",
    price: "29.99€/year",
    image: "/placeholder.svg?height=200&width=200&text=Membership",
    rating: 4.8,
  },
  {
    id: "4",
    name: "BORN PINK World Tour Hoodie",
    price: "79.99€",
    image: "/placeholder.svg?height=200&width=200&text=Tour+Hoodie",
    rating: 4.7,
  },
]

export default function ShopGrid() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Soon Available</h2>
      <div className="grid grid-cols-2 gap-4">
        {shopItems.map((item) => (
          <div key={item.id} className="rounded-lg bg-[#1a1f2c] p-3 opacity-60 relative">
            <div className="absolute top-2 right-2 z-10">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={200}
              height={200}
              className="mb-3 h-32 w-full rounded object-cover"
            />
            <h3 className="mb-1 text-sm font-semibold text-white">{item.name}</h3>
            <div className="mb-2 flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-400">{item.rating}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold" style={{ color: config.group.theme.primary }}>
                {item.price}
              </span>
              <Button size="sm" disabled style={{ backgroundColor: "#444" }}>
                <Lock className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
