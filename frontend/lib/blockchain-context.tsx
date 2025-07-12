"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
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

  // Essayer d'utiliser Privy, mais gérer le cas où il n'est pas disponible
  let privyState = null;
  try {
    privyState = usePrivy();
  } catch (error) {
    console.log('Privy non disponible, utilisation du mode développement');
  }

  // Utiliser Wagmi comme fallback
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();

  // Si Privy est disponible, l'utiliser
  if (privyState) {
    const { ready, authenticated, login, logout } = privyState;

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
    ready: mockState.ready,
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