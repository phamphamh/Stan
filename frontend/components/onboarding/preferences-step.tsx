"use client";

import { useEffect } from 'react';

interface PreferencesStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function PreferencesStep({ onNext }: PreferencesStepProps) {

  useEffect(() => {
    // Rediriger automatiquement vers l'étape suivante
    const timer = setTimeout(() => {
      onNext();
    }, 500);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300">Configuration des préférences...</p>
      </div>
    </div>
  );
}