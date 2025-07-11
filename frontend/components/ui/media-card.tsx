import Image from "next/image"
import type { MediaItem } from "@/lib/types"

interface MediaCardProps {
  item: MediaItem
}

export default function MediaCard({ item }: MediaCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <Image
        src={item.imageUrl || "/placeholder.svg"}
        alt={item.title}
        width={800}
        height={450}
        className="aspect-video w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <span className="mb-2 inline-block rounded bg-black/50 px-2 py-0.5 text-xs font-semibold">{item.tag}</span>
        <h3 className="text-xl font-bold">{item.title}</h3>
        <p className="text-sm text-gray-300">{item.subtitle}</p>
      </div>
      <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
        {item.currentPage}/{item.totalPages}
      </div>
    </div>
  )
}
