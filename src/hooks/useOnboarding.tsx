
import { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  isOnboardingActive: boolean;
  currentStep: number;
  totalSteps: number;
  startOnboarding: () => void;
  nextStep: () => void;
  skipOnboarding: () => void;
  isLastStep: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  // Don't automatically start onboarding
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  const startOnboarding = () => {
    setIsOnboardingActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      skipOnboarding();
    }
  };

  const skipOnboarding = () => {
    setIsOnboardingActive(false);
    setCurrentStep(0);
    localStorage.setItem('onboarding-completed', 'true');
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <OnboardingContext.Provider value={{
      isOnboardingActive,
      currentStep,
      totalSteps,
      startOnboarding,
      nextStep,
      skipOnboarding,
      isLastStep
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
