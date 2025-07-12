'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useArtistContract, useMission } from '@/hooks/use-contracts'
import { toast } from 'sonner'

interface MissionManagerProps {
  artistAddress: `0x${string}`
}

export function MissionManager({ artistAddress }: MissionManagerProps) {
  const { isConnected } = useAccount()
  const { openMission, registerForMission, completeMission, isPending, isArtist } = useArtistContract(artistAddress)
  
  const [missionName, setMissionName] = useState('')
  const [missionDescription, setMissionDescription] = useState('')
  const [missionReward, setMissionReward] = useState('')

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!missionName || !missionDescription || !missionReward) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const rewardAmount = BigInt(missionReward)
      await openMission(missionName, missionDescription, rewardAmount)
      toast.success('Mission creation transaction submitted!')
      setMissionName('')
      setMissionDescription('')
      setMissionReward('')
    } catch (error) {
      console.error('Error creating mission:', error)
      toast.error('Failed to create mission')
    }
  }

  if (!isArtist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mission Manager</CardTitle>
          <CardDescription>Only the artist can create missions</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mission Manager</CardTitle>
        <CardDescription>
          Create missions for your fans to complete and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateMission} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="missionName">Mission Name</Label>
            <Input
              id="missionName"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              placeholder="e.g., Follow on Twitter"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="missionDescription">Description</Label>
            <Textarea
              id="missionDescription"
              value={missionDescription}
              onChange={(e) => setMissionDescription(e.target.value)}
              placeholder="Describe what fans need to do..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="missionReward">Reward Amount (Fan Tokens)</Label>
            <Input
              id="missionReward"
              type="number"
              value={missionReward}
              onChange={(e) => setMissionReward(e.target.value)}
              placeholder="100"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!isConnected || isPending}
          >
            {isPending ? 'Creating...' : 'Create Mission'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface MissionCardProps {
  artistAddress: `0x${string}`
  missionId: number
}

export function MissionCard({ artistAddress, missionId }: MissionCardProps) {
  const { mission, fanStatus, isRegistered, isCompleted } = useMission(artistAddress, missionId)
  const { registerForMission, completeMission, isPending } = useArtistContract(artistAddress)

  const handleRegister = async () => {
    try {
      await registerForMission(missionId)
      toast.success('Registration transaction submitted!')
    } catch (error) {
      console.error('Error registering for mission:', error)
      toast.error('Failed to register for mission')
    }
  }

  const handleComplete = async () => {
    try {
      await completeMission(missionId)
      toast.success('Completion transaction submitted!')
    } catch (error) {
      console.error('Error completing mission:', error)
      toast.error('Failed to complete mission')
    }
  }

  if (!mission) {
    return <div>Loading mission...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{mission.name}</CardTitle>
            <CardDescription className="mt-1">{mission.description}</CardDescription>
          </div>
          <Badge variant={mission.status === 1 ? 'default' : 'secondary'}>
            {mission.status === 1 ? 'Active' : 'Closed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Reward: {mission.reward.toString()} Fan Tokens
          </div>
          
          {fanStatus === 0 && mission.status === 1 && (
            <Button 
              onClick={handleRegister}
              disabled={isPending}
              size="sm"
            >
              {isPending ? 'Registering...' : 'Register'}
            </Button>
          )}
          
          {isRegistered && !isCompleted && (
            <Button 
              onClick={handleComplete}
              disabled={isPending}
              size="sm"
            >
              {isPending ? 'Completing...' : 'Complete'}
            </Button>
          )}
          
          {isCompleted && (
            <Badge variant="outline">Completed</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}