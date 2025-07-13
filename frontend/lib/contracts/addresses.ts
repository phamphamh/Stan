// Adresses des contrats déployés sur Chiliz Mainnet (Chain ID: 88888)

export const CONTRACTS = {
  // ArtistFactory déployé
  ARTIST_FACTORY: '0x2e2961A6Fb170dC11a61A3F0A1b2323AFF364452',

  // BLACKPINK Artist contract déployé
  BLACKPINK_ARTIST: '0x7700834a9d3d775AF9553d81f010E9e09bd727f0',

  // BLACKPINK Fan Token (BP) (sera récupéré du contrat Artist)
  BLACKPINK_TOKEN: '', // À remplir après récupération depuis le contrat
} as const

// Chain ID pour Chiliz Mainnet
export const CHILIZ_CHAIN_ID = 88888