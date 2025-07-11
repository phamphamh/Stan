"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import TabBar from "@/components/ui/tab-bar"
import ShopGrid from "@/components/shop/shop-grid"
import RewardsGrid from "@/components/shop/rewards-grid"

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("Shop")

  useEffect(() => {
    redirect("/reward")
  }, [])

  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Shop" />}>
      <TabBar tabs={["Shop", "Rewards"]} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Shop" && <ShopGrid />}
        {activeTab === "Rewards" && <RewardsGrid />}
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
