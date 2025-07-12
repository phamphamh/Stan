import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// Configuration des contrats - À REMPLACER par les vraies adresses
export const ARTIST_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARTIST_CONTRACT_ADDRESS || '0x' // À fournir
export const ARTIST_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_ARTIST_TOKEN_ADDRESS || '0x' // À fournir

// ABI simplifié - À REMPLACER par le vrai ABI
export const ARTIST_ABI = [
  // Fonctions de lecture
  'function getMissionName(uint256 nb_mission) view returns (string)',
  'function getMissionDescription(uint256 nb_mission) view returns (string)',
  'function getMissionStatus(uint256 nb_mission) view returns (uint8)',
  'function getStatuFanOnMission(uint256 nb_mission, address fanAddress) view returns (uint8)',
  'function getArtistAddress() view returns (address)',
  'function getFanToken() view returns (address)',
  
  // Fonctions d\'écriture
  'function openMission(string memory name, string memory description, uint256 reward) returns (uint256)',
  'function registerFanOnMission(uint256 nb_mission, address fanAddress)',
  'function completeFanMission(uint256 nb_mission, address fanAddress)',
  
  // Événements
  'event MissionOpen(uint256 missionId, address artist)',
  'event Register(uint256 missionId, address fan)',
  'event Complete(uint256 missionId, address fan)',
] as const

export const TOKEN_ABI = [
  // Fonctions ERC20 standard
  'function balanceOf(address owner) view returns (uint256)',
  'function balanceOfEarnedToken(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  
  // Événements
  'event Transfer(address indexed from, address indexed to, uint256 value)',
] as const

// Hook pour créer une mission
export function useOpenMission() {
  const { data, write, isLoading, error } = useContractWrite({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'openMission',
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    openMission: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    txHash: data?.hash,
  }
}

// Hook pour s'inscrire à une mission
export function useRegisterMission() {
  const { address } = useAccount()
  const { data, write, isLoading, error } = useContractWrite({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'registerFanOnMission',
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const registerForMission = (missionId: number) => {
    if (!address) return
    write({
      args: [BigInt(missionId), address],
    })
  }

  return {
    registerForMission,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    txHash: data?.hash,
  }
}

// Hook pour compléter une mission
export function useCompleteMission() {
  const { address } = useAccount()
  const { data, write, isLoading, error } = useContractWrite({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'completeFanMission',
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const completeMission = (missionId: number) => {
    if (!address) return
    write({
      args: [BigInt(missionId), address],
    })
  }

  return {
    completeMission,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    txHash: data?.hash,
  }
}

// Hook pour lire les données d'une mission
export function useMissionData(missionId: number) {
  const { data: name } = useContractRead({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'getMissionName',
    args: [BigInt(missionId)],
  })

  const { data: description } = useContractRead({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'getMissionDescription',
    args: [BigInt(missionId)],
  })

  const { data: status } = useContractRead({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'getMissionStatus',
    args: [BigInt(missionId)],
  })

  return {
    name: name as string | undefined,
    description: description as string | undefined,
    status: status as number | undefined,
    isOpen: status === 1,
    isClosed: status === 2,
  }
}

// Hook pour lire le statut d'un fan sur une mission
export function useFanMissionStatus(missionId: number) {
  const { address } = useAccount()
  
  const { data: fanStatus } = useContractRead({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'getStatuFanOnMission',
    args: [BigInt(missionId), address || '0x'],
    enabled: !!address,
  })

  return {
    status: fanStatus as number | undefined,
    isNotRegistered: fanStatus === 0,
    isRegistered: fanStatus === 1,
    isCompleted: fanStatus === 2,
  }
}

// Hook pour lire le solde de tokens
export function useTokenBalance() {
  const { address } = useAccount()

  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: ARTIST_TOKEN_ADDRESS as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address || '0x'],
    enabled: !!address,
  })

  const { data: earnedBalance, refetch: refetchEarnedBalance } = useContractRead({
    address: ARTIST_TOKEN_ADDRESS as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'balanceOfEarnedToken',
    args: [address || '0x'],
    enabled: !!address,
  })

  return {
    balance: balance ? formatEther(balance) : '0',
    earnedBalance: earnedBalance ? formatEther(earnedBalance) : '0',
    refetchBalance,
    refetchEarnedBalance,
    refetchAll: () => {
      refetchBalance()
      refetchEarnedBalance()
    },
  }
}

// Hook pour les informations de l'artiste
export function useArtistInfo() {
  const { data: artistAddress } = useContractRead({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'getArtistAddress',
  })

  const { data: tokenAddress } = useContractRead({
    address: ARTIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: ARTIST_ABI,
    functionName: 'getFanToken',
  })

  return {
    artistAddress: artistAddress as string | undefined,
    tokenAddress: tokenAddress as string | undefined,
  }
}

// Types pour TypeScript
export interface Mission {
  id: number
  name: string
  description: string
  status: number
  reward: string
}

export interface FanMissionStatus {
  missionId: number
  status: number
  isRegistered: boolean
  isCompleted: boolean
}