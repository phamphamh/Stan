"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useBlockchain } from '@/lib/blockchain-context';
import { useUserProfile } from '@/hooks/useUserProfile';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, isAuthenticated } = useBlockchain();
  const { isProfileComplete } = useUserProfile();

  useEffect(() => {
    // Ne pas rediriger si on est déjà sur la page d'onboarding
    if (pathname === '/onboarding') return;

    // Attendre que Privy soit prêt
    if (!ready) return;

    // Vérifier si l'utilisateur doit passer par l'onboarding
    const needsOnboarding = !isAuthenticated || !isProfileComplete;

    if (needsOnboarding) {
      router.push('/onboarding');
    }
  }, [ready, isAuthenticated, isProfileComplete, pathname, router]);

  return <>{children}</>;
}