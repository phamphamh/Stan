"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePrivy } from '@privy-io/react-auth';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter();
  const { authenticated, ready } = usePrivy();
  const { profile, isProfileComplete, isLoading } = useUserProfile();

  useEffect(() => {
    // Attendre que Privy soit prêt et que le profil soit chargé
    if (!ready || isLoading) return;

    // Vérifier si on est déjà sur la page d'onboarding
    if (typeof window !== 'undefined' && window.location.pathname === '/onboarding') {
      return;
    }

    // Logique d'onboarding : rediriger si l'utilisateur n'a ni connexion Privy ni profil complet
    const needsOnboarding = (!authenticated && !isProfileComplete) ||
                           (authenticated && !isProfileComplete) ||
                           (!authenticated && profile && !isProfileComplete);

    if (needsOnboarding) {
      router.push('/onboarding');
    }
  }, [authenticated, isProfileComplete, router, ready, isLoading, profile]);

  // Afficher un loader pendant le chargement initial
  if (!ready || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0f1b] to-[#02040a]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur a besoin d'onboarding, afficher un loader pendant la redirection
  const needsOnboarding = (!authenticated && !isProfileComplete) ||
                         (authenticated && !isProfileComplete) ||
                         (!authenticated && profile && !isProfileComplete);

  if (needsOnboarding && typeof window !== 'undefined' && window.location.pathname !== '/onboarding') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0f1b] to-[#02040a]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Redirection vers l'onboarding...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}