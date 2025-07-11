import { Calendar } from "lucide-react"

const mockHistory = [
  { week: "Semaine du 4-10 Nov", winner: "OrbitalFan", points: 18500 },
  { week: "Semaine du 28 Oct-3 Nov", winner: "LunarOrbit", points: 17200 },
  { week: "Semaine du 21-27 Oct", winner: "StarGazer", points: 16800 },
  { week: "Semaine du 14-20 Oct", winner: "CosmicDream", points: 15900 },
]

export default function LeaderboardHistory() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Historique des classements</h2>
      <div className="space-y-3">
        {mockHistory.map((entry, index) => (
          <div key={index} className="flex items-center gap-4 rounded-lg bg-[#1a1f2c] p-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-semibold text-white">{entry.week}</p>
              <p className="text-sm text-gray-400">
                Gagnant: {entry.winner} • {entry.points.toLocaleString()} points
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
