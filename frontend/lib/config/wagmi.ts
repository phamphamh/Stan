import { createConfig, http } from 'wagmi'
import { chiliz } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Configuration de la chaîne Chiliz Mainnet
const chilizMainnet = {
  id: 88888,
  name: 'Chiliz Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'CHZ',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/chiliz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chiliz Explorer',
      url: 'https://scan.chiliz.com',
    },
  },
  testnet: false,
}

export const wagmiConfig = createConfig({
  chains: [chilizMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [chilizMainnet.id]: http('https://rpc.ankr.com/chiliz'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}