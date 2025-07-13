"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';

interface BlockchainContextType {
  isConnected: boolean;
  address: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  ready: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const [mockState, setMockState] = useState({
    isConnected: false,
    address: null as string | null,
    isAuthenticated: false,
    ready: true,
  });

  const [privyState, setPrivyState] = useState<any>(null);
  const [privyLoaded, setPrivyLoaded] = useState(false);

  // Utiliser Wagmi comme fallback
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();

  // Essayer de charger Privy de manière asynchrone
  useEffect(() => {
    const loadPrivy = async () => {
      try {
        const { usePrivy } = await import('@privy-io/react-auth');
        // Cette partie ne fonctionnera que si Privy est correctement configuré
        setPrivyLoaded(true);
      } catch (error) {
        console.log('Privy non disponible, utilisation du mode développement');
        setPrivyLoaded(true);
      }
    };

    loadPrivy();
  }, []);

  // Hook pour utiliser Privy si disponible
  const usePrivyHook = () => {
    try {
      const { usePrivy } = require('@privy-io/react-auth');
      return usePrivy();
    } catch (error) {
      return null;
    }
  };

  // Essayer d'utiliser Privy seulement si chargé
  let privyHookResult = null;
  if (privyLoaded) {
    try {
      privyHookResult = usePrivyHook();
    } catch (error) {
      console.log('Privy hook non disponible');
    }
  }

  // Si Privy est disponible et fonctionne, l'utiliser
  if (privyHookResult && privyHookResult.ready) {
    const { ready, authenticated, login, logout } = privyHookResult;

    const contextValue: BlockchainContextType = {
      isConnected: authenticated,
      address: authenticated ? wagmiAddress || null : null,
      isAuthenticated: authenticated,
      login,
      logout,
      ready,
    };

    return (
      <BlockchainContext.Provider value={contextValue}>
        {children}
      </BlockchainContext.Provider>
    );
  }

  // Mode développement sans Privy
  const contextValue: BlockchainContextType = {
    isConnected: mockState.isConnected,
    address: mockState.address,
    isAuthenticated: mockState.isAuthenticated,
    login: () => {
      console.log('Mode développement : simulation de connexion');
      setMockState(prev => ({
        ...prev,
        isConnected: true,
        isAuthenticated: true,
        address: '0x1234567890123456789012345678901234567890',
      }));
    },
    logout: () => {
      console.log('Mode développement : simulation de déconnexion');
      setMockState(prev => ({
        ...prev,
        isConnected: false,
        isAuthenticated: false,
        address: null,
      }));
    },
    ready: privyLoaded,
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}