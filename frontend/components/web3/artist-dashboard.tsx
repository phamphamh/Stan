'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useArtistByIndex, useArtistContract } from '@/hooks/use-contracts'
import { ArtistCreator } from './artist-creator'
import { MissionManager, MissionCard } from './mission-manager'
import { RewardManager, RewardCard } from './reward-manager'
import { WalletConnector } from './wallet-connector'
import { TokenVerifier } from './token-verifier'

export function ArtistDashboard() {
  const { isConnected } = useAccount()
  const [artistIndex, setArtistIndex] = useState(0)
  const { artistAddress } = useArtistByIndex(artistIndex)
  const { isArtist, artistInfo, fanTokenAddress } = useArtistContract(artistAddress)
  
  const [missionIds, setMissionIds] = useState<number[]>([0]) // Start with mission 0 for demo
  const [rewardIds, setRewardIds] = useState<number[]>([0]) // Start with reward 0 for demo

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Artist Platform</h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to start creating and managing artist experiences
          </p>
        </div>
        <div className="flex justify-center">
          <WalletConnector />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Artist Platform</h1>
        <p className="text-muted-foreground">
          Create missions, manage rewards, and engage with your fans
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WalletConnector />
        <ArtistCreator />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Artist</CardTitle>
          <CardDescription>
            Enter an artist index to view their contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              value={artistIndex}
              onChange={(e) => setArtistIndex(Number(e.target.value))}
              placeholder="Artist index"
              className="flex-1"
            />
            <Button onClick={() => setArtistIndex(artistIndex)}>
              Load Artist
            </Button>
          </div>
          
          {artistAddress && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium">Artist Contract</div>
              <div className="text-sm text-muted-foreground font-mono break-all">
                {artistAddress}
              </div>
              {fanTokenAddress && (
                <>
                  <div className="text-sm font-medium">Fan Token</div>
                  <div className="text-sm text-muted-foreground font-mono break-all">
                    {fanTokenAddress}
                  </div>
                </>
              )}
              <div className="text-sm">
                <span className="font-medium">Role: </span>
                {isArtist ? 'Artist (Owner)' : 'Fan'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {artistAddress && (
        <>
          <TokenVerifier tokenAddress={fanTokenAddress as `0x${string}`} artistAddress={artistAddress} />
          
          <Tabs defaultValue="missions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="missions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Missions</h3>
              <Button 
                variant="outline"
                onClick={() => setMissionIds([...missionIds, missionIds.length])}
              >
                Load More Missions
              </Button>
            </div>
            <div className="grid gap-4">
              {missionIds.map((id) => (
                <MissionCard
                  key={id}
                  artistAddress={artistAddress}
                  missionId={id}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rewards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Rewards</h3>
              <Button 
                variant="outline"
                onClick={() => setRewardIds([...rewardIds, rewardIds.length])}
              >
                Load More Rewards
              </Button>
            </div>
            <div className="grid gap-4">
              {rewardIds.map((id) => (
                <RewardCard
                  key={id}
                  artistAddress={artistAddress}
                  rewardId={id}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-6">
            {isArtist ? (
              <div className="grid gap-6 md:grid-cols-2">
                <MissionManager artistAddress={artistAddress} />
                <RewardManager artistAddress={artistAddress} />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Management</CardTitle>
                  <CardDescription>
                    Only the artist can manage missions and rewards
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        </>
      )}
    </div>
  )
}