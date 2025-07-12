import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { CONTRACTS } from '../contracts/addresses'
import { ARTIST_FACTORY_ABI, ARTIST_ABI, ERC20_ABI } from '../contracts/abis'

// Hook pour l'ArtistFactory
export function useArtistFactory() {
  const { writeContract } = useWriteContract()

  const createArtist = async (name: string, symbol: string) => {
    return writeContract({
      address: CONTRACTS.ARTIST_FACTORY,
      abi: ARTIST_FACTORY_ABI,
      functionName: 'newArtist',
      args: [name, symbol],
    })
  }

  const { data: artistAddress } = useReadContract({
    address: CONTRACTS.ARTIST_FACTORY,
    abi: ARTIST_FACTORY_ABI,
    functionName: 'getArtistAddress',
    args: [0n], // Index 0 pour BLACKPINK
  })

  const { data: artistIndex } = useReadContract({
    address: CONTRACTS.ARTIST_FACTORY,
    abi: ARTIST_FACTORY_ABI,
    functionName: '_index',
  })

  return {
    createArtist,
    artistAddress,
    artistIndex,
  }
}

// Hook pour le contrat Artist BLACKPINK
export function useBlackpinkArtist() {
  const { address: userAddress } = useAccount()
  const { writeContract } = useWriteContract()
  const artistAddress = CONTRACTS.BLACKPINK_ARTIST

  // Adresse du Fan Token
  const { data: fanTokenAddress } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getFanToken',
  })

  // Adresse de l'artiste (owner du contrat)
  const { data: artistOwner } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getArtistAddress',
  })

  // Fonction pour lire une mission spécifique
  const getMissionData = (missionId: bigint) => {
    const { data: name } = useReadContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'getMissionName',
      args: [missionId],
    })

    const { data: description } = useReadContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'getMissionDescription',
      args: [missionId],
    })

    const { data: status } = useReadContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'getMissionStatus',
      args: [missionId],
    })

    const { data: fanStatus } = useReadContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'getStatuFanOnMission',
      args: [missionId, userAddress!],
      query: {
        enabled: !!userAddress,
      },
    })

    return { name, description, status, fanStatus }
  }

  // Fonction pour créer une mission (admin seulement)
  const createMission = async (name: string, description: string, reward: bigint) => {
    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'openMission',
      args: [name, description, reward],
    })
  }

  // Fonction pour s'inscrire à une mission (fan)
  const registerForMission = async (missionId: bigint) => {
    if (!userAddress) throw new Error('Wallet not connected')

    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'registerFanOnMission',
      args: [missionId, userAddress],
    })
  }

  // Fonction pour compléter une mission (fan)
  const completeMission = async (missionId: bigint) => {
    if (!userAddress) throw new Error('Wallet not connected')

    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'completeFanMission',
      args: [missionId, userAddress],
    })
  }

  // Fonction pour fermer une mission (admin seulement)
  const closeMission = async (missionId: bigint, fanAddress?: string) => {
    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'closeMission',
      args: [missionId, fanAddress || '0x0000000000000000000000000000000000000000'],
    })
  }

  // Vérifier si l'utilisateur est l'artiste (owner du contrat)
  const isArtist = userAddress && artistOwner && userAddress.toLowerCase() === artistOwner.toLowerCase()

  return {
    // Données
    fanTokenAddress,
    artistOwner,
    artistAddress,
    isArtist,
    getMissionData,

    // Actions
    createMission,
    registerForMission,
    completeMission,
    closeMission,
  }
}

// Hook pour le Fan Token BLACKPINK (BP)
export function useBlackpinkToken() {
  const { address: userAddress } = useAccount()
  const { fanTokenAddress } = useBlackpinkArtist()

  // Solde total du token
  const { data: balance } = useReadContract({
    address: fanTokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress!],
    query: {
      enabled: !!userAddress && !!fanTokenAddress,
    },
  })

  // Solde des tokens gagnés (earned tokens)
  const { data: earnedBalance } = useReadContract({
    address: fanTokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOfEarnedToken',
    args: [userAddress!],
    query: {
      enabled: !!userAddress && !!fanTokenAddress,
    },
  })

  // Informations du token
  const { data: tokenName } = useReadContract({
    address: fanTokenAddress,
    abi: ERC20_ABI,
    functionName: 'name',
  })

  const { data: tokenSymbol } = useReadContract({
    address: fanTokenAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
  })

  const { data: tokenDecimals } = useReadContract({
    address: fanTokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
  })

  return {
    balance,
    earnedBalance,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    tokenAddress: fanTokenAddress,
  }
}

// Hook pour récupérer les données d'une mission spécifique
export function useMissionData(missionId: bigint) {
  const { address: userAddress } = useAccount()
  const artistAddress = CONTRACTS.BLACKPINK_ARTIST

  const { data: name } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionName',
    args: [missionId],
  })

  const { data: description } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionDescription',
    args: [missionId],
  })

  const { data: status } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionStatus',
    args: [missionId],
  })

  const { data: fanStatus } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getStatuFanOnMission',
    args: [missionId, userAddress!],
    query: {
      enabled: !!userAddress,
    },
  })

  return {
    name,
    description,
    status,
    fanStatus,
    isOpen: status === 1,
    isClosed: status === 2,
    isNotRegistered: fanStatus === 0,
    isRegistered: fanStatus === 1,
    isCompleted: fanStatus === 2,
  }
}

// Hook combiné pour toutes les données BLACKPINK
export function useBlackpinkData() {
  const artist = useBlackpinkArtist()
  const token = useBlackpinkToken()
  const factory = useArtistFactory()

  return {
    artist,
    token,
    factory,
  }
}