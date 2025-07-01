
import { Switch } from '@/components/ui/switch';

interface SoundOptionProps {
  sound: {
    id: string;
    name: string;
    emoji: string;
    description: string;
  };
  isActive: boolean;
  onToggle: (soundId: string) => void;
}

export const SoundOption = ({ sound, isActive, onToggle }: SoundOptionProps) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
        isActive
          ? 'border-green-400 bg-green-50 shadow-lg'
          : 'border-green-200 bg-white hover:border-green-300'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">{sound.emoji}</div>
        <div>
          <h4 className="font-bold text-green-800">{sound.name}</h4>
          <p className="text-sm text-green-600">{sound.description}</p>
        </div>
      </div>
      
      <Switch
        checked={isActive}
        onCheckedChange={() => onToggle(sound.id)}
        className="data-[state=checked]:bg-green-600"
      />
    </div>
  );
};
