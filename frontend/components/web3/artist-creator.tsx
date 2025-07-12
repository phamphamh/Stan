'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMissionMaker } from '@/hooks/use-contracts'
import { toast } from 'sonner'

export function ArtistCreator() {
  const { address, isConnected } = useAccount()
  const { createArtist, isPending, isConfirming, isConfirmed } = useMissionMaker()
  
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!name || !symbol) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await createArtist(name, symbol)
      toast.success('Artist creation transaction submitted!')
    } catch (error) {
      console.error('Error creating artist:', error)
      toast.error('Failed to create artist')
    }
  }

  if (isConfirmed) {
    toast.success('Artist created successfully!')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Artist</CardTitle>
        <CardDescription>
          Create a new artist contract to manage missions and rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Artist Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter artist name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symbol">Token Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., LISA, BTS"
              required
            />
          </div>


          <Button 
            type="submit" 
            className="w-full"
            disabled={!isConnected || isPending || isConfirming}
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Create Artist'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}