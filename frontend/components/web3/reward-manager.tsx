'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useArtistContract, useReward } from '@/hooks/use-contracts'
import { toast } from 'sonner'

interface RewardManagerProps {
  artistAddress: `0x${string}`
}

export function RewardManager({ artistAddress }: RewardManagerProps) {
  const { isConnected } = useAccount()
  const { openReward, isPending, isArtist } = useArtistContract(artistAddress)
  
  const [rewardName, setRewardName] = useState('')
  const [rewardDescription, setRewardDescription] = useState('')
  const [rewardPrice, setRewardPrice] = useState('')

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!rewardName || !rewardDescription || !rewardPrice) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const priceAmount = BigInt(rewardPrice)
      await openReward(rewardName, rewardDescription, priceAmount)
      toast.success('Reward creation transaction submitted!')
      setRewardName('')
      setRewardDescription('')
      setRewardPrice('')
    } catch (error) {
      console.error('Error creating reward:', error)
      toast.error('Failed to create reward')
    }
  }

  if (!isArtist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reward Manager</CardTitle>
          <CardDescription>Only the artist can create rewards</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reward Manager</CardTitle>
        <CardDescription>
          Create rewards that fans can purchase with their earned tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateReward} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rewardName">Reward Name</Label>
            <Input
              id="rewardName"
              value={rewardName}
              onChange={(e) => setRewardName(e.target.value)}
              placeholder="e.g., Signed Photo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rewardDescription">Description</Label>
            <Textarea
              id="rewardDescription"
              value={rewardDescription}
              onChange={(e) => setRewardDescription(e.target.value)}
              placeholder="Describe the reward..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rewardPrice">Price (Fan Tokens)</Label>
            <Input
              id="rewardPrice"
              type="number"
              value={rewardPrice}
              onChange={(e) => setRewardPrice(e.target.value)}
              placeholder="500"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!isConnected || isPending}
          >
            {isPending ? 'Creating...' : 'Create Reward'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface RewardCardProps {
  artistAddress: `0x${string}`
  rewardId: number
}

export function RewardCard({ artistAddress, rewardId }: RewardCardProps) {
  const { reward } = useReward(artistAddress, rewardId)
  const { claimReward, isPending } = useArtistContract(artistAddress)

  const handleClaim = async () => {
    try {
      await claimReward(rewardId)
      toast.success('Claim transaction submitted!')
    } catch (error) {
      console.error('Error claiming reward:', error)
      toast.error('Failed to claim reward')
    }
  }

  if (!reward) {
    return <div>Loading reward...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{reward.name}</CardTitle>
            <CardDescription className="mt-1">{reward.description}</CardDescription>
          </div>
          <Badge variant={reward.status === 1 ? 'default' : 'secondary'}>
            {reward.status === 1 ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Price: {reward.price.toString()} Fan Tokens
          </div>
          
          {reward.status === 1 && (
            <Button 
              onClick={handleClaim}
              disabled={isPending}
              size="sm"
            >
              {isPending ? 'Claiming...' : 'Claim'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}