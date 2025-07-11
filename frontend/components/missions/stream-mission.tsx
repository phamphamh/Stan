import { Play, Headphones, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"

const streamMissions = [
  {
    id: 1,
    title: "Stream 'Pink Venom' 10 fois",
    platform: "Spotify",
    icon: Headphones,
    progress: 7,
    goal: 10,
    reward: 50,
  },
  {
    id: 2,
    title: "Regarder le MV 'DDU-DU DDU-DU'",
    platform: "YouTube",
    icon: Play,
    progress: 1,
    goal: 1,
    reward: 25,
  },
  {
    id: 3,
    title: "Écouter l'album 'THE ALBUM'",
    platform: "Apple Music",
    icon: Headphones,
    progress: 0,
    goal: 1,
    reward: 100,
  },
]

export default function StreamMission() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Missions de Stream</h2>
      <p className="text-gray-400">Gagnez des tokens en écoutant et regardant BLACKPINK.</p>
      <div className="space-y-3">
        {streamMissions.map((mission) => {
          const isCompleted = mission.progress >= mission.goal
          const progressPercentage = (mission.progress / mission.goal) * 100
          return (
            <div key={mission.id} className="rounded-lg bg-[#1a1f2c] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <mission.icon className="h-6 w-6" style={{ color: config.group.theme.primary }} />
                  <div>
                    <h3 className="font-semibold text-white">{mission.title}</h3>
                    <p className="text-xs text-gray-400">sur {mission.platform}</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: config.group.theme.primary }}>
                  +{mission.reward} Tokens
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progression</span>
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
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#333" : config.group.theme.secondary,
                  color: "white",
                }}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Terminé
                  </>
                ) : (
                  "Commencer"
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
