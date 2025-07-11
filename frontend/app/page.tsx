import AppShell from "@/components/layout/app-shell"
import TopNav from "@/components/nav/top-nav"
import BottomNav from "@/components/nav/bottom-nav"
import NewsCarousel from "@/components/home/news-carousel"
import EventCard from "@/components/home/event-card"
import NewsGrid from "@/components/home/news-grid"
import WeeklyLeaderboardHome from "@/components/home/weekly-leaderboard-home"

export default function HomePage() {
  return (
    <AppShell topNav={<TopNav />} bottomNav={<BottomNav activeTab="Home" />}>
      <div className="flex-1 space-y-4 scrollable px-4 pb-4">
        <NewsCarousel />
        <EventCard />
        <NewsGrid />
        <WeeklyLeaderboardHome />
        <div className="h-16" />
      </div>
    </AppShell>
  )
}
