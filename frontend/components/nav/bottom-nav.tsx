"use client"

import { Home, Target, Gift, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Missions", icon: Target, href: "/missions" },
  { name: "Reward", icon: Gift, href: "/reward" },
  { name: "Wallet", icon: Wallet, href: "/wallet" },
]

interface BottomNavProps {
  activeTab: string
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  return (
    <nav className="h-20 w-full flex-shrink-0 border-t border-gray-800 bg-[#0f1421]/80 backdrop-blur-sm">
      <div className="flex h-full items-start justify-around pt-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.name
          return (
            <Link href={item.href} key={item.name} className="flex flex-col items-center gap-1 text-center">
              <item.icon
                className={cn("h-6 w-6", isActive ? "text-white" : "text-gray-500")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn("text-xs", isActive ? "font-bold text-white" : "text-gray-500")}>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
