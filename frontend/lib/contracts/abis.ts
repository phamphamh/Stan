// ABIs des contrats pour les interactions frontend

export const ARTIST_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "_index",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_name", "type": "string"}, {"internalType": "string", "name": "_symbole", "type": "string"}],
    "name": "newArtist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "index_", "type": "uint256"}],
    "name": "getArtist",
    "outputs": [{"internalType": "contract Artist", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "index_", "type": "uint256"}],
    "name": "getArtistAddress",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const ARTIST_ABI = [
  // Fonctions pour les missions
  {
    "inputs": [{"internalType": "string", "name": "name_", "type": "string"}, {"internalType": "string", "name": "description_", "type": "string"}, {"internalType": "uint256", "name": "reward_", "type": "uint256"}],
    "name": "openMission",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_mission_", "type": "uint256"}, {"internalType": "address", "name": "fanAddress_", "type": "address"}],
    "name": "registerFanOnMission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_mission_", "type": "uint256"}, {"internalType": "address", "name": "fanAddress_", "type": "address"}],
    "name": "completeFanMission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_mission_", "type": "uint256"}, {"internalType": "address", "name": "fanAddress_", "type": "address"}],
    "name": "getStatuFanOnMission",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_mission_", "type": "uint256"}],
    "name": "getMissionName",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_mission_", "type": "uint256"}],
    "name": "getMissionDescription",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_mission_", "type": "uint256"}],
    "name": "getMissionStatus",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Fonctions pour les récompenses
  {
    "inputs": [{"internalType": "string", "name": "name_", "type": "string"}, {"internalType": "string", "name": "description_", "type": "string"}, {"internalType": "uint256", "name": "price_", "type": "uint256"}],
    "name": "openReward",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_reward_", "type": "uint256"}, {"internalType": "address", "name": "fanAddress_", "type": "address"}],
    "name": "claimRewardFan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_reward_", "type": "uint256"}],
    "name": "getRewardName",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_reward_", "type": "uint256"}],
    "name": "getRewardDescription",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "nb_reward_", "type": "uint256"}],
    "name": "getRewardStatus",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Fonctions utilitaires
  {
    "inputs": [],
    "name": "getArtistAddress",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFanToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const ERC20_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "fanAddress_", "type": "address"}],
    "name": "balanceOfEarnedToken",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const