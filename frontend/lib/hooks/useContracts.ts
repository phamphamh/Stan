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
  const { artistAddress } = useArtistFactory()

  // Fonctions de lecture des missions
  const { data: missionName } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionName',
    args: [0n], // Mission index
  })

  const { data: missionDescription } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionDescription',
    args: [0n],
  })

  const { data: missionStatus } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getMissionStatus',
    args: [0n],
  })

  // Statut du fan sur une mission
  const { data: fanMissionStatus } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getStatuFanOnMission',
    args: [0n, userAddress!],
    query: {
      enabled: !!userAddress,
    },
  })

  // Adresse du Fan Token
  const { data: fanTokenAddress } = useReadContract({
    address: artistAddress,
    abi: ARTIST_ABI,
    functionName: 'getFanToken',
  })

  // Fonctions d'écriture
  const registerForMission = async (missionId: bigint) => {
    if (!userAddress) throw new Error('Wallet not connected')

    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'registerFanOnMission',
      args: [missionId, userAddress],
    })
  }

  const completeMission = async (missionId: bigint) => {
    if (!userAddress) throw new Error('Wallet not connected')

    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'completeFanMission',
      args: [missionId, userAddress],
    })
  }

  const claimReward = async (rewardId: bigint) => {
    if (!userAddress) throw new Error('Wallet not connected')

    return writeContract({
      address: artistAddress,
      abi: ARTIST_ABI,
      functionName: 'claimRewardFan',
      args: [rewardId, userAddress],
    })
  }

  return {
    // Données des missions
    missionName,
    missionDescription,
    missionStatus,
    fanMissionStatus,
    fanTokenAddress,

    // Actions
    registerForMission,
    completeMission,
    claimReward,
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