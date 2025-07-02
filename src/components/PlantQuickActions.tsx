
import { Button } from '@/components/ui/button';
import { Droplets, Sun, Scissors, RotateCcw, Camera, Share } from 'lucide-react';

interface PlantQuickActionsProps {
  plant: any;
  onAction: (action: string) => void;
}

export const PlantQuickActions = ({ plant, onAction }: PlantQuickActionsProps) => {
  const actions = [
    { id: 'water', icon: Droplets, label: 'Water', color: 'text-blue-600' },
    { id: 'light', icon: Sun, label: 'Light Check', color: 'text-yellow-600' },
    { id: 'prune', icon: Scissors, label: 'Prune', color: 'text-green-600' },
    { id: 'rotate', icon: RotateCcw, label: 'Rotate', color: 'text-purple-600' },
    { id: 'photo', icon: Camera, label: 'Photo', color: 'text-gray-600' },
    { id: 'share', icon: Share, label: 'Share', color: 'text-pink-600' }
  ];

  return (
    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
      <div className="text-sm font-medium text-gray-700 mb-3">Quick Actions</div>
      <div className="grid grid-cols-3 gap-2">
        {actions.map(action => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            onClick={() => onAction(action.id)}
            className="flex flex-col items-center p-3 h-auto hover:bg-white"
          >
            <action.icon className={`h-5 w-5 ${action.color} mb-1`} />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
