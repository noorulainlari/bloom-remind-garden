
import { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Plant Care Tracker! 🌱',
    description: 'Let\'s take a quick tour to help you get started with caring for your plants.',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'add-plant',
    title: 'Add Your First Plant',
    description: 'Click this button to add your first plant. You can search our database or add custom plants.',
    target: '[data-tour="add-plant-fab"]',
    position: 'left'
  },
  {
    id: 'plant-search',
    title: 'Search Plants',
    description: 'Start typing to search our database of 100+ plants with pre-configured care schedules.',
    target: '[data-tour="plant-search"]',
    position: 'bottom'
  },
  {
    id: 'watering-reminders',
    title: 'Smart Reminders',
    description: 'Each plant card shows when to water next and tracks your watering history.',
    target: '[data-tour="plant-card"]',
    position: 'top'
  },
  {
    id: 'sound-settings',
    title: 'Ambient Sounds',
    description: 'Enjoy relaxing nature sounds while caring for your plants.',
    target: '[data-tour="sound-settings"]',
    position: 'top'
  }
];

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  steps: OnboardingStep[];
  startOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  isCompleted: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed');
    if (!completed) {
      // Start onboarding for first-time users after a short delay
      setTimeout(() => setIsActive(true), 1000);
    } else {
      setIsCompleted(true);
    }
  }, []);

  const startOnboarding = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setIsActive(false);
    setIsCompleted(true);
    localStorage.setItem('onboarding-completed', 'true');
  };

  return (
    <OnboardingContext.Provider value={{
      isActive,
      currentStep,
      steps: ONBOARDING_STEPS,
      startOnboarding,
      nextStep,
      prevStep,
      skipOnboarding,
      isCompleted
    }}>
      {children}  
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
