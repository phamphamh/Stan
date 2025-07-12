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
import MissionCreator from "@/components/missions/mission-creator"

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState("Active Missions")

  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Missions" />}>
      <TabBar tabs={["Active Missions", "Create Mission", "Content", "Stream", "Shop"]} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Active Missions" && <ActiveMissions />}
        {activeTab === "Create Mission" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Create New Mission</h2>
            <MissionCreator />
          </div>
        )}
        {activeTab === "Content" && <ClipFarmMission />}
        {activeTab === "Stream" && <StreamMission />}
        {activeTab === "Shop" && <ShopMission />}
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
