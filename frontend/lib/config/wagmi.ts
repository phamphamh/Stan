import { createConfig, http } from 'wagmi'
import { chiliz } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Configuration de la chaîne Chiliz
const chilizChain = {
  id: 88882,
  name: 'Chiliz Spicy Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CHZ',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: {
      http: ['https://spicy-rpc.chiliz.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chiliz Explorer',
      url: 'https://spicy-explorer.chiliz.com',
    },
  },
  testnet: true,
}

export const wagmiConfig = createConfig({
  chains: [chilizChain],
  connectors: [
    injected(),
  ],
  transports: {
    [chilizChain.id]: http('https://spicy-rpc.chiliz.com'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}