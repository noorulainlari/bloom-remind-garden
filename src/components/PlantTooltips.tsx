
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
        <TooltipContent className="bg-green-800 text-white border-green-600">
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const PlantTooltips = {
  WateringInterval: () => (
    <PlantTooltip content="How often your plant needs water. This varies by plant type, season, and environment." />
  ),
  PhotoUpload: () => (
    <PlantTooltip content="Upload a photo to track your plant's growth over time. Photos help you remember which plant is which!" />
  ),
  LastWatered: () => (
    <PlantTooltip content="The last date you watered this plant. This helps calculate when to water next." />
  ),
  PlantName: () => (
    <PlantTooltip content="Give your plant a custom name or use its common/scientific name. This helps you identify it easily." />
  ),
};
