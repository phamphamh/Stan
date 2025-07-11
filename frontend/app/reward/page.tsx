"use client"

import { useState } from "react"
import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import TabBar from "@/components/ui/tab-bar"
import RewardsGrid from "@/components/shop/rewards-grid"
import ShopGrid from "@/components/shop/shop-grid"

export default function RewardPage() {
  const [activeTab, setActiveTab] = useState("Reward")

  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Reward" />}>
      <TabBar tabs={["Reward", "Shop"]} onTabChange={setActiveTab} />
      <div className="flex-1 scrollable p-4">
        {activeTab === "Reward" && <RewardsGrid />}
        {activeTab === "Shop" && <ShopGrid />}
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
