export const privyConfig = {
  // Utilisez votre vrai App ID Privy depuis https://dashboard.privy.io/
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clxxx-xxxxx-xxxxx-xxxxx',
  config: {
    loginMethods: ['email', 'wallet'],
    appearance: {
      theme: 'dark',
      accentColor: '#e91e63',
      showWalletLoginFirst: true,
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      requireUserPasswordOnCreate: false,
    },
    supportedChains: [
      {
        id: 88888,
        name: 'Chiliz Chain',
        network: 'chiliz',
        nativeCurrency: {
          name: 'CHZ',
          symbol: 'CHZ',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://rpc.ankr.com/chiliz'],
          },
          public: {
            http: ['https://rpc.ankr.com/chiliz'],
          },
        },
        blockExplorers: {
          default: {
            name: 'ChilizScan',
            url: 'https://scan.chiliz.com',
          },
        },
      },
    ],
    defaultChain: {
      id: 88888,
      name: 'Chiliz Chain',
    },
  },
}