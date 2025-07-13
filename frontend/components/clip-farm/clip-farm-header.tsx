"use client"

import { Youtube, Music2, LinkIcon, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ClipFarmHeader() {
  const [isYouTubeLinked, setIsYouTubeLinked] = useState(false)
  const [isTikTokLinked, setIsTikTokLinked] = useState(false) // Changé à false pour montrer "Soon"

  return (
    <div className="space-y-4">
      {/* Comptes liés */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">My accounts</h3>

        {/* YouTube */}
        <div className="flex items-center justify-between rounded-lg bg-[#1a1f2c] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">YouTube</p>
              <p className="text-xs text-gray-400">Unbound</p>
            </div>
          </div>
          <Button
            size="sm"
            disabled
            className="text-gray-500 bg-gray-700 cursor-not-allowed"
          >
            <Clock className="mr-1 h-3 w-3" />
            Soon
          </Button>
        </div>

        {/* TikTok */}
        <div className="flex items-center justify-between rounded-lg bg-[#1a1f2c] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
              <Music2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">TikTok</p>
              <p className="text-xs text-gray-400">Unbound</p>
            </div>
          </div>
          <Button
            size="sm"
            disabled
            className="text-gray-500 bg-gray-700 cursor-not-allowed"
          >
            <Clock className="mr-1 h-3 w-3" />
            Soon
          </Button>
        </div>
      </div>

      {/* Message d'information */}
      <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
        <p className="text-sm text-blue-400">
          💡 Account linking features coming soon!
        </p>
      </div>
    </div>
  )
}
