"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useBlockchain } from '@/lib/blockchain-context';
import { useUserProfile } from '@/hooks/useUserProfile';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, isAuthenticated } = useBlockchain();
  const { isProfileComplete } = useUserProfile();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Ne pas rediriger si on est déjà sur la page d'onboarding
    if (pathname === '/onboarding') {
      setHasChecked(true);
      return;
    }

    // Attendre que le système soit prêt
    if (!ready) return;

    // Éviter les vérifications multiples
    if (hasChecked) return;

    // Vérifier si l'utilisateur doit passer par l'onboarding
    const needsOnboarding = !isAuthenticated || !isProfileComplete;

    console.log('OnboardingGuard check:', {
      pathname,
      ready,
      isAuthenticated,
      isProfileComplete,
      needsOnboarding
    });

    if (needsOnboarding) {
      console.log('Redirecting to onboarding...');
      router.push('/onboarding');
    }

    setHasChecked(true);
  }, [ready, isAuthenticated, isProfileComplete, pathname, router, hasChecked]);

  // Réinitialiser hasChecked quand on change de page
  useEffect(() => {
    setHasChecked(false);
  }, [pathname]);

  return <>{children}</>;
}