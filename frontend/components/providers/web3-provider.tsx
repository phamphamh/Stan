"use client";

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/config/wagmi';
import { BlockchainProvider } from '@/lib/blockchain-context';
import { TokensProvider } from '@/lib/tokens-context';
import { ReactNode, useState, useEffect } from 'react';
import { privyConfig } from '@/lib/config/privy';

interface Web3ProviderProps {
  children: ReactNode;
}

// Composant wrapper pour Privy qui gère les erreurs
function PrivyWrapper({ children }: { children: ReactNode }) {
  const [PrivyProvider, setPrivyProvider] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadPrivy = async () => {
      try {
        const { PrivyProvider: Provider } = await import('@privy-io/react-auth');
        setPrivyProvider(() => Provider);
      } catch (error) {
        console.error('Failed to load Privy:', error);
        setLoadError(true);
      }
    };

    // Vérifier si l'App ID Privy est configuré
    const isPrivyConfigured = privyConfig.appId &&
      privyConfig.appId !== 'clxxx-xxxxx-xxxxx-xxxxx' &&
      !privyConfig.appId.includes('xxxxx');

    if (isPrivyConfigured) {
      loadPrivy();
    } else {
      setLoadError(true);
    }
  }, []);

  if (loadError || !PrivyProvider) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config}
      onSuccess={(user: any) => {
        console.log('User connected:', user);
      }}
      onError={(error: any) => {
        console.error('Privy error:', error);
      }}
    >
      {children}
    </PrivyProvider>
  );
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

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <PrivyWrapper>
          <TokensProvider>
            <BlockchainProvider>
              {!isPrivyConfigured && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 m-4">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ <strong>Mode développement</strong> : Privy non configuré.
                    <br />
                    Créez un compte sur <a href="https://dashboard.privy.io/" target="_blank" rel="noopener noreferrer" className="underline">dashboard.privy.io</a> et configurez NEXT_PUBLIC_PRIVY_APP_ID dans .env.local
                  </p>
                </div>
              )}
              {children}
            </BlockchainProvider>
          </TokensProvider>
        </PrivyWrapper>
      </WagmiProvider>
    </QueryClientProvider>
  );
}