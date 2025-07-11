import Image from "next/image"
import type { AtmosphereItem } from "@/lib/types"

interface AtmosphereCardProps {
  item: AtmosphereItem
}

export default function AtmosphereCard({ item }: AtmosphereCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-[#1a1f2c] p-3">
      <Image
        src={item.logoUrl || "/placeholder.svg"}
        alt={`${item.artist} logo`}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{item.artist}</span>
          <span>&middot;</span>
          <span>{item.date}</span>
        </div>
        <p className="font-medium text-white">{item.title}</p>
      </div>
    </div>
  )
}
