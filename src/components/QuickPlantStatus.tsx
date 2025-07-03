
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Sun, Thermometer } from 'lucide-react';

interface QuickPlantStatusProps {
  plant: any;
}

export const QuickPlantStatus = ({ plant }: QuickPlantStatusProps) => {
  const getWaterStatus = () => {
    const nextWaterDate = new Date(plant.next_water_date);
    const today = new Date();
    const daysUntilWater = Math.ceil((nextWaterDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilWater <= 0) return { status: 'Needs Water', color: 'destructive' };
    if (daysUntilWater <= 2) return { status: 'Soon', color: 'secondary' };
    return { status: 'Good', color: 'default' };
  };

  const waterStatus = getWaterStatus();

  return (
    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
      <Droplets className="h-4 w-4 text-blue-500" />
      <Badge variant={waterStatus.color as any} className="text-xs">
        {waterStatus.status}
      </Badge>
      <Sun className="h-4 w-4 text-yellow-500" />
      <span className="text-xs text-green-700">Sunny</span>
      <Thermometer className="h-4 w-4 text-red-500" />
      <span className="text-xs text-green-700">22°C</span>
    </div>
  );
};
