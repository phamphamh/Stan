import { CalendarCheck2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AttendanceBanner() {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <CalendarCheck2 className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <h3 className="font-semibold">Daily Attendance</h3>
          <p className="text-sm text-muted-foreground">Check in today to earn rewards</p>
        </div>
        <Button size="sm">Check In</Button>
      </div>
    </div>
  )
}
