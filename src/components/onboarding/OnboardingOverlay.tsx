
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

export const OnboardingOverlay = () => {
  const { isActive, currentStep, steps, nextStep, prevStep, skipOnboarding } = useOnboarding();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const currentStepData = steps[currentStep];
    const targetElement = document.querySelector(currentStepData.target);
    
    if (targetElement && overlayRef.current) {
      const rect = targetElement.getBoundingClientRect();
      const overlay = overlayRef.current;

      // Calculate position for the tooltip
      let top = rect.bottom + 10;
      let left = rect.left;

      switch (currentStepData.position) {
        case 'top':
          top = rect.top - 10;
          break;
        case 'left':
          top = rect.top;
          left = rect.left - 320;
          break;
        case 'right':
          top = rect.top;
          left = rect.right + 10;
          break;
        default:
          break;
      }

      overlay.style.top = `${top}px`;
      overlay.style.left = `${Math.max(10, left)}px`;

      // Highlight the target element
      targetElement.classList.add('onboarding-highlight');
      
      return () => {
        targetElement.classList.remove('onboarding-highlight');
      };
    }
  }, [isActive, currentStep, steps]);

  if (!isActive || !steps[currentStep]) return null;

  const currentStepData = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-[100] pointer-events-auto" />
      
      {/* Tooltip */}
      <div
        ref={overlayRef}
        className="fixed z-[101] max-w-sm"
        style={{ transform: 'translate(0, -100%)' }}
      >
        <Card className="shadow-2xl border-2 border-green-300 animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-green-800">
                {currentStepData.title}
              </CardTitle>
              <Button
                onClick={skipOnboarding}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-green-700 leading-relaxed">
              {currentStepData.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep ? 'bg-green-600' : 'bg-green-200'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                {!isFirst && (
                  <Button onClick={prevStep} variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                
                <Button onClick={nextStep} size="sm" className="garden-button">
                  {isLast ? 'Finish' : 'Next'}
                  {!isLast && <ArrowRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
