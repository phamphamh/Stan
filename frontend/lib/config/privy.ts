export const privyConfig = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'demo-app-id',
  config: {
    loginMethods: ['email', 'google', 'wallet'] as ('email' | 'google' | 'wallet')[],
    appearance: {
      theme: 'dark' as const,
      accentColor: '#e91e63' as `#${string}`,
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets' as const,
    },
  },
}