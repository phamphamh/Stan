export const privyConfig = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'demo-app-id',
  config: {
    loginMethods: ['email', 'wallet'],
    appearance: {
      theme: 'dark',
      accentColor: '#e91e63',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    },
  },
}