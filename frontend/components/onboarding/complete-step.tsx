"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CompleteStepProps {
  onComplete: () => void;
  isCompleting: boolean;
}

export function CompleteStep({ onComplete }: CompleteStepProps) {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Éviter les appels multiples
    if (hasStarted) return;

    setHasStarted(true);

    // Créer le profil et rediriger vers l'accueil
    const completeOnboarding = async () => {
      try {
        await onComplete();
        router.push('/');
      } catch (error) {
        console.error('Error completing onboarding:', error);
        // Rediriger quand même vers l'accueil
        router.push('/');
      }
    };

    completeOnboarding();
  }, [hasStarted, onComplete, router]);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300">Finalisation de votre profil...</p>
      </div>
    </div>
  );
}