"use client"

import { useState } from "react"
import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import TabBar from "@/components/ui/tab-bar"
import ClipFarmMission from "@/components/missions/clip-farm-mission"
import StreamMission from "@/components/missions/stream-mission"
import ShopMission from "@/components/missions/shop-mission"
import ActiveMissions from "@/components/missions/active-missions"

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState("Active Missions")

  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Missions" />}>
      <TabBar tabs={["Active Missions", "Content", "Stream", "Shop", "Live (Soon)"]} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Active Missions" && <ActiveMissions />}
        {activeTab === "Content" && <ClipFarmMission />}
        {activeTab === "Stream" && <StreamMission />}
        {activeTab === "Shop" && <ShopMission />}
        {activeTab === "Live (Soon)" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Coming Soon</h2>
            <div className="text-center text-gray-400 py-8">
              <p className="text-lg mb-2">🚀 This feature is coming soon!</p>
              <p className="text-sm">We're working hard to bring you more exciting missions.</p>
            </div>
          </div>
        )}
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
