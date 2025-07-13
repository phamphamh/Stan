"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';
import { WelcomeStep } from "@/components/onboarding/welcome-step";
import { WalletStep } from "@/components/onboarding/wallet-step";
import { ProfileStep } from "@/components/onboarding/profile-step";
import { PreferencesStep } from "@/components/onboarding/preferences-step";
import { CompleteStep } from "@/components/onboarding/complete-step";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBlockchain } from "@/lib/blockchain-context";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const STEPS = [
  { id: 'welcome', title: 'Bienvenue', description: 'Découvrez l\'univers BLACKPINK' },
  { id: 'wallet', title: 'Wallet', description: 'Connectez votre wallet' },
  { id: 'profile', title: 'Profil', description: 'Créez votre profil de fan' },
  { id: 'preferences', title: 'Préférences', description: 'Personnalisez votre expérience' },
  { id: 'complete', title: 'Terminé', description: 'Votre profil est prêt !' }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [stepsToShow, setStepsToShow] = useState(STEPS);
  const { ready, isAuthenticated } = useBlockchain();
  const { hasProfile, createProfile, isProfileComplete } = useUserProfile();
  const router = useRouter();

  // Redirect if already completed (mais seulement après que tout soit prêt)
  useEffect(() => {
    if (ready && isAuthenticated && isProfileComplete) {
      console.log('User already completed onboarding, redirecting to home');
      router.push('/');
    }
  }, [ready, isAuthenticated, isProfileComplete, router]);

  // Adapt steps based on what's missing
  useEffect(() => {
    if (!ready) return;

    const adaptedSteps = [];

    // Always show welcome
    adaptedSteps.push(STEPS[0]);

    // Show wallet step only if not authenticated
    if (!isAuthenticated) {
      adaptedSteps.push(STEPS[1]);
    }

    // Show profile step only if no profile or profile incomplete
    if (!hasProfile || !isProfileComplete) {
      adaptedSteps.push(STEPS[2]);
    }

    // Show preferences step only if no profile or profile incomplete
    if (!hasProfile || !isProfileComplete) {
      adaptedSteps.push(STEPS[3]);
    }

    // Always show complete step
    adaptedSteps.push(STEPS[4]);

    setStepsToShow(adaptedSteps);
  }, [ready, isAuthenticated, hasProfile, isProfileComplete]);

  const progress = ((currentStep + 1) / stepsToShow.length) * 100;

  const handleNext = () => {
    if (currentStep < stepsToShow.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (isCompleting) return; // Éviter les appels multiples

    setIsCompleting(true);
    try {
      console.log('Completing onboarding...');
      // Create user profile and redirect to home
      await createProfile();
      console.log('Profile created, redirecting to home...');
      router.push('/');
    } catch (error) {
      console.error("Erreur completion onboarding:", error);
      // Rediriger quand même vers l'accueil
      router.push('/');
    } finally {
      setIsCompleting(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f1b] to-[#02040a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    const currentStepData = stepsToShow[currentStep];
    if (!currentStepData) return null;

    switch (currentStepData.id) {
      case 'welcome':
        return <WelcomeStep onNext={handleNext} />;
      case 'wallet':
        return <WalletStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 'profile':
        return <ProfileStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 'preferences':
        return <PreferencesStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 'complete':
        return <CompleteStep onComplete={handleComplete} isCompleting={isCompleting} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1b] to-[#02040a] overflow-auto">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Bienvenue dans l'univers BLACKPINK
          </h1>
          <p className="text-sm md:text-base text-gray-300">
            Configurons votre profil de fan en quelques étapes
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-300">
              Étape {currentStep + 1} sur {stepsToShow.length}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {Math.round(progress)}% complété
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700" />

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {stepsToShow.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-pink-500' : 'text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="text-xs mt-2 text-center max-w-20">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-gray-400">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation (for steps that don't have custom navigation) */}
        {currentStep > 0 && currentStep < stepsToShow.length - 1 && (
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            <Button
              onClick={handleNext}
              className="bg-pink-500 hover:bg-pink-600"
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}