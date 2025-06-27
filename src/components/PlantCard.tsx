
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Trash2, Calendar, CheckCircle, Camera, Leaf, Heart } from 'lucide-react';
import { format, parseISO, isToday, isPast, differenceInDays } from 'date-fns';

interface Plant {
  id: string;
  plant_name: string;
  scientific_name: string;
  watering_interval_days: number;
  last_watered: string;
  next_water_date: string;
  photo_url: string;
  custom_name?: string;
  last_watered_timestamp?: string | null;
}

interface PlantCardProps {
  plant: Plant;
  onWater: (plantId: string) => void;
  onRemove: (plantId: string, photoUrl?: string) => void;
  isWatered?: boolean;
}

export const PlantCard = ({ plant, onWater, onRemove, isWatered = false }: PlantCardProps) => {
  const [showNotes, setShowNotes] = useState(false);
  
  const getWaterStatus = () => {
    const date = parseISO(plant.next_water_date);
    const today = new Date();
    const daysUntilWater = differenceInDays(date, today);
    
    if (isToday(date)) {
      return { 
        text: '💧 Water Today', 
        variant: 'default' as const, 
        urgent: true,
        progress: 100,
        status: 'due'
      };
    } else if (isPast(date)) {
      const daysOverdue = Math.abs(daysUntilWater);
      return { 
        text: `🚨 ${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue`, 
        variant: 'destructive' as const, 
        urgent: true,
        progress: 100,
        status: 'overdue'
      };
    } else {
      const progressPercent = Math.max(0, 100 - (daysUntilWater / plant.watering_interval_days) * 100);
      let status = 'healthy';
      if (daysUntilWater <= 2) status = 'due-soon';
      
      return { 
        text: `💧 Water in ${daysUntilWater} day${daysUntilWater === 1 ? '' : 's'}`, 
        variant: 'secondary' as const, 
        urgent: false,
        progress: progressPercent,
        status
      };
    }
  };

  const waterStatus = getWaterStatus();
  const wasRecentlyWatered = plant.last_watered_timestamp && 
    new Date(plant.last_watered_timestamp).toDateString() === new Date().toDateString();

  const getProgressColor = () => {
    switch (waterStatus.status) {
      case 'overdue': return 'bg-red-500';
      case 'due': return 'bg-yellow-500';
      case 'due-soon': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };

  const getPlantEmoji = () => {
    const name = plant.plant_name.toLowerCase();
    if (name.includes('cactus')) return '🌵';
    if (name.includes('rose')) return '🌹';
    if (name.includes('succulent')) return '🪴';
    if (name.includes('herb') || name.includes('basil') || name.includes('mint')) return '🌿';
    if (name.includes('tree') || name.includes('ficus')) return '🌳';
    return '🌱';
  };

  return (
    <Card className={`
      transition-all duration-500 shadow-lg hover:shadow-xl plant-card
      ${isWatered || wasRecentlyWatered ? 'watered-card animate-pulse-glow' : ''}
      ${waterStatus.urgent ? 'ring-2 ring-orange-300 shadow-orange-100' : ''}
    `}>
      <CardHeader className="pb-3 relative">
        <div className="absolute top-2 right-2">
          <div className="text-2xl animate-gentle-float">{getPlantEmoji()}</div>
        </div>
        
        <div className="flex justify-between items-start gap-2 pr-12">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl text-green-800 truncate flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600 animate-leaf-sway" />
              {plant.custom_name || plant.plant_name}
            </CardTitle>
            {plant.scientific_name && (
              <p className="text-sm text-green-600 italic truncate">{plant.scientific_name}</p>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-green-700 font-medium">Watering Progress</span>
            <Badge variant={waterStatus.variant} className="text-xs whitespace-nowrap">
              {waterStatus.text}
            </Badge>
          </div>
          <div className="w-full bg-green-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${getProgressColor()}`}
              style={{ width: `${Math.min(100, waterStatus.progress)}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {plant.photo_url ? (
          <div className="relative group">
            <img
              src={plant.photo_url}
              alt={plant.custom_name || plant.plant_name}
              className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 backdrop-blur-sm">
              <Camera className="h-4 w-4 text-green-600" />
            </div>
            {(isWatered || wasRecentlyWatered) && (
              <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-2 backdrop-blur-sm">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-32 sm:h-40 garden-gradient rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden">
            <div className="text-4xl sm:text-5xl animate-gentle-float">{getPlantEmoji()}</div>
            <div className="absolute inset-0 leaf-pattern opacity-30" />
            {(isWatered || wasRecentlyWatered) && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 bg-white rounded-full" />
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-green-700">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Last: {format(parseISO(plant.last_watered), 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-blue-600">
            <Droplets className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Next: {format(parseISO(plant.next_water_date), 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="text-green-600 font-medium flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            Every {plant.watering_interval_days} day{plant.watering_interval_days === 1 ? '' : 's'}
          </div>

          {(isWatered || wasRecentlyWatered) && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                {plant.last_watered_timestamp ? 
                  `Watered today at ${new Date(plant.last_watered_timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` :
                  'Watered today ✅'
                }
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onWater(plant.id)}
            size="sm"
            className="flex-1 garden-button transition-all duration-300"
            disabled={isWatered}
          >
            {isWatered ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Watered! 🌿
              </>
            ) : (
              <>
                <Droplets className="h-4 w-4 mr-1" />
                💧 Water Plant
              </>
            )}
          </Button>
          <Button
            onClick={() => onRemove(plant.id, plant.photo_url)}
            size="sm"
            variant="destructive"
            className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
