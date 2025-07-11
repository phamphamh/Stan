"use client"

import { Coins } from "lucide-react"
import { useState } from "react"
import ProfileModal from "@/components/modals/profile-modal"
import Image from "next/image"
import Link from "next/link"
import { config } from "@/lib/config"

export default function TopNav() {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <header className="flex h-14 flex-shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-bold text-white" style={{ color: config.group.theme.primary }}>
            BLACKPINK
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Token Balance - Clickable */}
          <Link href="/wallet">
            <div
              className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: config.group.theme.primary + "20",
                color: config.group.theme.primary,
              }}
            >
              <Coins className="h-4 w-4" />
              <span>{config.user.tokens.toFixed(1)}</span>
            </div>
          </Link>

          {/* Profile Button */}
          <button onClick={() => setShowProfile(true)} aria-label="Profile" className="relative">
            <Image
              src="/placeholder.svg?height=32&width=32&text=User"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div
              className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0a0f1b]"
              style={{ backgroundColor: config.group.theme.primary }}
            />
          </button>
        </div>
      </header>

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  )
}
