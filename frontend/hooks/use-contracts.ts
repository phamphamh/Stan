'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useAccount } from 'wagmi'
import { MISSION_MAKER_ADDRESS, MISSION_MAKER_ABI, ARTIST_ABI, type ArtistInfo, type Mission, type Reward } from '@/lib/contracts'
import { useState } from 'react'

export function useMissionMaker() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createArtist = async (name: string, symbol: string) => {
    return writeContract({
      address: MISSION_MAKER_ADDRESS,
      abi: MISSION_MAKER_ABI,
      functionName: 'newArtist',
      args: [name, symbol],
    })
  }

  return {
    createArtist,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

export function useArtistContract(artistAddress?: `0x${string}`) {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read functions
  const { data: artistInfo } = useReadContract({
    address: MISSION_MAKER_ADDRESS,
    abi: MISSION_MAKER_ABI,
    functionName: 'getArtistContract',
    args: artistAddress ? [artistAddress] : undefined,
    query: {
      enabled: !!artistAddress,
    },
  }) as { data: ArtistInfo | undefined }

  const { data: fanTokenAddress } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getFanToken',
    query: {
      enabled: !!artistAddress,
    },
  })

  const { data: artistOwner } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'artistAddress',
    query: {
      enabled: !!artistAddress,
    },
  })

  // Write functions
  const openMission = async (name: string, description: string, reward: bigint) => {
    if (!artistAddress) throw new Error('Artist address required')
    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'openMission',
      args: [name, description, reward],
    })
  }

  const openReward = async (name: string, description: string, price: bigint) => {
    if (!artistAddress) throw new Error('Artist address required')
    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'openReward',
      args: [name, description, price],
    })
  }

  const registerForMission = async (missionId: number) => {
    if (!artistAddress || !address) throw new Error('Artist address and user address required')
    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'registerFanOnMission',
      args: [BigInt(missionId), address],
    })
  }

  const completeMission = async (missionId: number) => {
    if (!artistAddress || !address) throw new Error('Artist address and user address required')
    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'completeFanMission',
      args: [BigInt(missionId), address],
    })
  }

  const claimReward = async (rewardId: number) => {
    if (!artistAddress || !address) throw new Error('Artist address and user address required')
    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'claimRewardFan',
      args: [BigInt(rewardId), address],
    })
  }

  // Helper to check if current user is the artist
  const isArtist = address && artistOwner && address.toLowerCase() === artistOwner.toLowerCase()

  return {
    // Read data
    artistInfo,
    fanTokenAddress,
    artistOwner,
    isArtist,
    
    // Write functions
    openMission,
    openReward,
    registerForMission,
    completeMission,
    claimReward,
    
    // Transaction status
    hash,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

export function useMission(artistAddress?: `0x${string}`, missionId?: number) {
  const { address } = useAccount()
  
  const { data: name } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionName',
    args: missionId !== undefined ? [BigInt(missionId)] : undefined,
    query: {
      enabled: !!artistAddress && missionId !== undefined,
    },
  })

  const { data: description } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionDescription',
    args: missionId !== undefined ? [BigInt(missionId)] : undefined,
    query: {
      enabled: !!artistAddress && missionId !== undefined,
    },
  })

  const { data: status } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionStatus',
    args: missionId !== undefined ? [BigInt(missionId)] : undefined,
    query: {
      enabled: !!artistAddress && missionId !== undefined,
    },
  })

  const { data: fanStatus } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getStatuFanOnMission',
    args: missionId !== undefined && address ? [BigInt(missionId), address] : undefined,
    query: {
      enabled: !!artistAddress && missionId !== undefined && !!address,
    },
  })

  const mission: Mission | undefined = name && description && status !== undefined && missionId !== undefined ? {
    id: missionId,
    name,
    description,
    status,
    reward: BigInt(0), // You might want to add this to the contract
  } : undefined

  return {
    mission,
    fanStatus, // 0: not registered, 1: registered, 2: completed
    isRegistered: fanStatus === 1,
    isCompleted: fanStatus === 2,
  }
}

export function useReward(artistAddress?: `0x${string}`, rewardId?: number) {
  const { data: name } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getRewardName',
    args: rewardId !== undefined ? [BigInt(rewardId)] : undefined,
    query: {
      enabled: !!artistAddress && rewardId !== undefined,
    },
  })

  const { data: description } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getRewardDescription',
    args: rewardId !== undefined ? [BigInt(rewardId)] : undefined,
    query: {
      enabled: !!artistAddress && rewardId !== undefined,
    },
  })

  const reward: Reward | undefined = name && description && rewardId !== undefined ? {
    id: rewardId,
    name,
    description,
    status: 1, // You might want to add this to the contract
    price: BigInt(0), // You might want to add this to the contract
  } : undefined

  return {
    reward,
  }
}

export function useArtistByIndex(index: number) {
  const { data: artistAddress } = useReadContract({
    address: MISSION_MAKER_ADDRESS,
    abi: MISSION_MAKER_ABI,
    functionName: 'getArtistAddress',
    args: [BigInt(index)],
    query: {
      enabled: index >= 0,
    },
  })

  return {
    artistAddress: artistAddress as `0x${string}` | undefined,
  }
}