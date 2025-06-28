
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlantTooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const PlantTooltip = ({ content, children }: PlantTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />}
        </TooltipTrigger>
        <TooltipContent className="bg-green-800 text-white border-green-600 max-w-xs p-3">
          <p className="text-sm font-semibold">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const PlantTooltips = {
  WateringInterval: () => (
    <PlantTooltip content="How often your plant needs water. This varies by plant type, season, and environment. Adjust based on your plant's specific needs." />
  ),
  PhotoUpload: () => (
    <PlantTooltip content="Upload photos to track your plant's growth over time. Photos help you remember which plant is which and monitor their health!" />
  ),
  LastWatered: () => (
    <PlantTooltip content="The last date you watered this plant. This helps calculate when to water next and track your watering history." />
  ),
  PlantName: () => (
    <PlantTooltip content="Give your plant a custom nickname or use its common/scientific name. This helps you identify it easily in your collection." />
  ),
  WaterNow: () => (
    <PlantTooltip content="Mark this plant as watered right now. This will update the watering schedule and reset the countdown timer." />
  ),
  PlaySounds: () => (
    <PlantTooltip content="Play relaxing nature sounds while you tend to your plants. Choose from birds, wind, or rain sounds." />
  ),
  PauseSounds: () => (
    <PlantTooltip content="Pause the ambient sounds. Your sound preference will be saved for next time." />
  ),
  StopSounds: () => (
    <PlantTooltip content="Stop the ambient sounds completely. You can start them again anytime." />
  ),
};
