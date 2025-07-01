
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';

export const OnboardingOverlay = () => {
  const { 
    isOnboardingActive, 
    currentStep, 
    totalSteps, 
    nextStep, 
    skipOnboarding, 
    isLastStep 
  } = useOnboarding();

  // Don't render anything if onboarding is not active
  if (!isOnboardingActive) {
    return null;
  }

  const steps = [
    {
      target: '[data-tour="welcome"]',
      title: '🌱 Welcome to Plant Care Tracker!',
      content: 'Track your plants, get watering reminders, and never forget plant care again!'
    },
    {
      target: '[data-tour="add-plant"]',
      title: '✨ Add Your First Plant',
      content: 'Click here to search and add plants from our database or create custom ones.'
    },
    {
      target: '[data-tour="sound-settings"]',
      title: '🎵 Ambient Sounds',
      content: 'Relax with nature sounds while caring for your plants.'
    },
    {
      target: '[data-tour="add-plant-fab"]',
      title: '⚡ Quick Add',
      content: 'Use this floating button for quick plant additions anywhere.'
    },
    {
      target: '[data-tour="theme-toggle"]',
      title: '🌙 Theme Toggle',
      content: 'Switch between light and dark modes for comfortable viewing.'
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={skipOnboarding} />
      
      {/* Onboarding Card */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md border-2 border-green-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                {currentStepData.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipOnboarding}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {currentStepData.content}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={skipOnboarding}>
                Skip Tour
              </Button>
              <Button onClick={nextStep} className="garden-button">
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
