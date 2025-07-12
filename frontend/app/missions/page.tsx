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
      <TabBar tabs={["Active Missions", "Clip Farm", "Stream", "Shop", "Live"]} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Active Missions" && <ActiveMissions />}
        {activeTab === "Clip Farm" && <ClipFarmMission />}
        {activeTab === "Stream" && <StreamMission />}
        {activeTab === "Shop" && <ShopMission />}
        {/* Placeholder for Live */}
        {activeTab === "Live" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Live Missions</h2>
            <p className="text-gray-400">Join live streams and earn tokens</p>
            <div className="text-center text-gray-400 py-8">Live mission content coming soon.</div>
          </div>
        )}
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
