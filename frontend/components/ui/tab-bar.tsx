"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TabBarProps {
  tabs: string[]
  defaultTab?: string
  onTabChange?: (tab: string) => void
}

export default function TabBar({ tabs, defaultTab, onTabChange }: TabBarProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <div className="flex-shrink-0 border-b border-gray-800 px-4">
      <div className="relative flex items-center gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={cn(
              "relative z-10 py-3 text-lg font-medium transition-colors",
              activeTab === tab ? "text-white" : "text-gray-500",
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="active-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
