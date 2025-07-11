"use client"

import { useState } from "react"
import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import TabBar from "@/components/ui/tab-bar"
import ClipFarmMission from "@/components/missions/clip-farm-mission"
import StreamMission from "@/components/missions/stream-mission"
import ShopMission from "@/components/missions/shop-mission"

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState("Clip Farm")

  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Missions" />}>
      <TabBar tabs={["Clip Farm", "Stream", "Shop", "Live"]} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Clip Farm" && <ClipFarmMission />}
        {activeTab === "Stream" && <StreamMission />}
        {activeTab === "Shop" && <ShopMission />}
        {/* Placeholder for Live */}
        {activeTab === "Live" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Missions Live</h2>
            <p className="text-gray-400">Participez aux lives et gagnez des tokens</p>
            <div className="text-center text-gray-400 py-8">Contenu des missions Live à venir.</div>
          </div>
        )}
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
