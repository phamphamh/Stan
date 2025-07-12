import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import TokensOverview from "@/components/wallet/tokens-overview"
import { PrivyWallet } from "@/components/wallet/privy-wallet"

export default function WalletPage() {
  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Wallet" />}>
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">My Wallet</h1>
          <p className="text-gray-400">Manage your tokens and transactions</p>
        </div>
        <PrivyWallet />
        <TokensOverview />
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
