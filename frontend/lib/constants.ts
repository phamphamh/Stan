// Mapping des missions frontend vers IDs blockchain
export const MISSION_MAPPING = {
  'stream-mission': 0,
  'content-mission': 1, 
  'tweet-mission': 2,
  'photocard-mission': 3,
} as const

export type MissionId = keyof typeof MISSION_MAPPING