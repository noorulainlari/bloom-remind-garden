
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  activeSoundCount: number;
  onVolumeChange: (volume: number[]) => void;
}

export const VolumeControl = ({ volume, activeSoundCount, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <VolumeX className="h-5 w-5 text-gray-500" />
        <Slider
          value={[volume]}
          onValueChange={onVolumeChange}
          max={100}
          step={5}
          className="flex-1"
        />
        <Volume2 className="h-5 w-5 text-gray-500" />
      </div>
      <p className="text-sm text-green-600 text-center font-semibold">
        Volume: {volume}% | Active Sounds: {activeSoundCount}
      </p>
    </div>
  );
};
