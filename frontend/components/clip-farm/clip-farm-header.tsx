"use client"

import { Youtube, Music2, LinkIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ClipFarmHeader() {
  const [isYouTubeLinked, setIsYouTubeLinked] = useState(false)
  const [isTikTokLinked, setIsTikTokLinked] = useState(true) // Simulé comme déjà lié

  return (
    <div className="space-y-4">
      {/* Comptes liés */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Mes comptes</h3>

        {/* YouTube */}
        <div className="flex items-center justify-between rounded-lg bg-[#1a1f2c] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">YouTube</p>
              <p className="text-xs text-gray-400">{isYouTubeLinked ? "@EditMaster2024" : "Non lié"}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={isYouTubeLinked ? "outline" : "default"}
            onClick={() => setIsYouTubeLinked(!isYouTubeLinked)}
            className={isYouTubeLinked ? "text-gray-400" : ""}
          >
            {isYouTubeLinked ? (
              <>
                <LinkIcon className="mr-1 h-3 w-3" />
                Lié
              </>
            ) : (
              <>
                <Plus className="mr-1 h-3 w-3" />
                Lier
              </>
            )}
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
              <p className="text-xs text-gray-400">{isTikTokLinked ? "@kpop_edits_master" : "Non lié"}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={isTikTokLinked ? "outline" : "default"}
            onClick={() => setIsTikTokLinked(!isTikTokLinked)}
            className={isTikTokLinked ? "text-gray-400" : ""}
          >
            {isTikTokLinked ? (
              <>
                <LinkIcon className="mr-1 h-3 w-3" />
                Lié
              </>
            ) : (
              <>
                <Plus className="mr-1 h-3 w-3" />
                Lier
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Message d'information */}
      {(!isYouTubeLinked || !isTikTokLinked) && (
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
          <p className="text-sm text-blue-400">
            💡 Liez vos comptes pour participer automatiquement aux défis et gagner des tokens !
          </p>
        </div>
      )}
    </div>
  )
}
