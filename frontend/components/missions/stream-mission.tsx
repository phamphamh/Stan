import { Play, Headphones, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"

const streamMissions = [
  {
    id: 1,
    title: "Stream 'Pink Venom' 10 times",
    platform: "Spotify",
    icon: Headphones,
    progress: 0,
    goal: 10,
    reward: 50,
    comingSoon: true,
  },
  {
    id: 2,
    title: "Watch 'DDU-DU DDU-DU' MV",
    platform: "YouTube",
    icon: Play,
    progress: 0,
    goal: 1,
    reward: 25,
    comingSoon: true,
  },
  {
    id: 3,
    title: "Listen to 'THE ALBUM' full album",
    platform: "Apple Music",
    icon: Headphones,
    progress: 0,
    goal: 1,
    reward: 100,
    comingSoon: true,
  },
  {
    id: 4,
    title: "Stream 'How You Like That' 20 times",
    platform: "Spotify",
    icon: Headphones,
    progress: 0,
    goal: 20,
    reward: 75,
    comingSoon: true,
  },
  {
    id: 5,
    title: "Watch 'Kill This Love' MV",
    platform: "YouTube",
    icon: Play,
    progress: 0,
    goal: 1,
    reward: 30,
    comingSoon: true,
  },
]

export default function StreamMission() {
  const handleMissionComplete = (missionId: number) => {
    // Simulate mission completion
    alert(`Mission ${missionId} completed! 🎉`)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Stream Missions</h2>
        <p className="text-gray-400">Earn tokens by listening to and watching BLACKPINK content</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Clock className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-yellow-400">Coming Soon</span>
        </div>
      </div>

      <div className="space-y-3">
        {streamMissions.map((mission) => {
          const progressPercentage = (mission.progress / mission.goal) * 100
          return (
            <div key={mission.id} className="rounded-lg bg-[#1a1f2c] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <mission.icon className="h-6 w-6" style={{ color: config.group.theme.primary }} />
                  <div>
                    <h3 className="font-semibold text-white">{mission.title}</h3>
                    <p className="text-xs text-gray-400">on {mission.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: config.group.theme.primary }}>
                    +{mission.reward} Tokens
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>
                    {mission.progress} / {mission.goal}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPercentage}%`,
                      backgroundColor: config.group.theme.primary,
                    }}
                  />
                </div>
              </div>

              <Button
                className="mt-4 w-full"
                disabled={mission.comingSoon}
                onClick={() => handleMissionComplete(mission.id)}
                style={{
                  backgroundColor: mission.comingSoon ? "#374151" : config.group.theme.primary,
                  color: mission.comingSoon ? "#9CA3AF" : "white",
                }}
              >
                {mission.comingSoon ? (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Soon
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Complete Mission
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          🎵 Stream BLACKPINK content to earn tokens and show your support!
        </p>
      </div>
    </div>
  )
}
