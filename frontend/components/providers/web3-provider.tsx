"use client";

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { privyConfig } from '@/lib/config/privy';
import { wagmiConfig } from '@/lib/config/wagmi';
import { BlockchainProvider } from '@/lib/blockchain-context';
import { TokensProvider } from '@/lib/tokens-context';
import { ReactNode, useState, useEffect } from 'react';

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Éviter les erreurs d'hydratation
  if (!mounted) {
    return null;
  }

  // Vérifier si l'App ID Privy est configuré
  const isPrivyConfigured = privyConfig.appId &&
    privyConfig.appId !== 'clxxx-xxxxx-xxxxx-xxxxx' &&
    !privyConfig.appId.includes('xxxxx');

  // Si Privy n'est pas configuré, utiliser seulement Wagmi
  if (!isPrivyConfigured) {
    console.warn('⚠️ Privy App ID non configuré. Fonctionnement en mode développement sans authentification.');

    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <TokensProvider>
            <BlockchainProvider>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 m-4">
                <p className="text-yellow-200 text-sm">
                  ⚠️ <strong>Mode développement</strong> : Privy non configuré.
                  <br />
                  Créez un compte sur <a href="https://dashboard.privy.io/" target="_blank" rel="noopener noreferrer" className="underline">dashboard.privy.io</a> et configurez NEXT_PUBLIC_PRIVY_APP_ID dans .env.local
                </p>
              </div>
              {children}
            </BlockchainProvider>
          </TokensProvider>
        </WagmiProvider>
      </QueryClientProvider>
    );
  }

  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config}
      onSuccess={(user) => {
        console.log('User connected:', user);
      }}
      onError={(error) => {
        console.error('Privy error:', error);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <TokensProvider>
            <BlockchainProvider>
              {children}
            </BlockchainProvider>
          </TokensProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}