import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Trash2, Calendar, CheckCircle, Camera, Leaf, Heart, Share2 } from 'lucide-react';
import { format, parseISO, isToday, isPast, differenceInDays } from 'date-fns';

interface Plant {
  id: string;
  plant_name: string;
  scientific_name?: string;
  watering_interval_days: number;
  last_watered: string;
  next_water_date: string;
  photo_url?: string;
  custom_name?: string;
  last_watered_timestamp?: string | null;
}

interface PlantCardProps {
  plant: Plant;
  onUpdate?: () => void;
  actions?: React.ReactNode;
}

// Rotating plant facts
const PLANT_FACTS = [
  "🌱 This plant loves you back when you care for it!",
  "💧 Proper watering is key to healthy growth.",
  "🌿 Plants can boost your mood and air quality.",
  "🌸 Regular care leads to beautiful blooms.",
  "🍃 Your plant appreciates consistent schedules.",
  "🌺 Healthy plants = happy homes!",
  "🌵 Each plant has its own personality and needs.",
  "🌳 Growing plants is growing happiness!"
];

export const PlantCard = ({ plant, onUpdate, actions }: PlantCardProps) => {
  const [showNotes, setShowNotes] = useState(false);
  const [currentFact] = useState(PLANT_FACTS[Math.floor(Math.random() * PLANT_FACTS.length)]);
  
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
      case 'overdue': return 'bg-gradient-to-r from-red-500 to-red-400';
      case 'due': return 'bg-gradient-to-r from-yellow-500 to-orange-400';
      case 'due-soon': return 'bg-gradient-to-r from-orange-500 to-yellow-400';
      default: return 'bg-gradient-to-r from-green-500 to-emerald-400';
    }
  };

  const getPlantEmoji = () => {
    const name = plant.plant_name.toLowerCase();
    if (name.includes('cactus')) return '🌵';
    if (name.includes('rose')) return '🌹';
    if (name.includes('succulent')) return '🪴';
    if (name.includes('herb') || name.includes('basil') || name.includes('mint')) return '🌿';
    if (name.includes('tree') || name.includes('ficus')) return '🌳';
    if (name.includes('flower')) return '🌸';
    if (name.includes('lily')) return '🌺';
    return '🌱';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ${plant.custom_name || plant.plant_name}`,
        text: `Check out my plant! I water it every ${plant.watering_interval_days} days.`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      const shareText = `My ${plant.custom_name || plant.plant_name} - I water it every ${plant.watering_interval_days} days! 🌱`;
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <Card className="transition-all duration-500 shadow-lg hover:shadow-2xl plant-card transform hover:scale-102 rounded-2xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="pb-3 relative bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="text-2xl animate-gentle-float drop-shadow-sm">{getPlantEmoji()}</div>
          <Button
            onClick={handleShare}
            size="sm"
            variant="ghost"
            className="text-green-600 hover:text-green-700 hover:bg-green-100 p-1 h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-start gap-2 pr-20">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl text-green-800 truncate flex items-center gap-2 font-bold">
              <Leaf className="h-5 w-5 text-green-600 animate-leaf-sway" />
              {plant.custom_name || plant.plant_name}
            </CardTitle>
            {plant.scientific_name && (
              <p className="text-sm text-green-600 italic truncate font-medium">{plant.scientific_name}</p>
            )}
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-green-700 font-semibold">Watering Progress</span>
            <Badge variant={waterStatus.variant} className="text-xs whitespace-nowrap px-3 py-1 rounded-full font-medium shadow-sm">
              {waterStatus.text}
            </Badge>
          </div>
          <div className="w-full bg-green-100 rounded-full h-3 overflow-hidden shadow-inner border border-green-200">
            <div 
              className={`h-full transition-all duration-1000 ${getProgressColor()} shadow-sm animate-pulse`}
              style={{ width: `${Math.min(100, waterStatus.progress)}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6">
        {plant.photo_url ? (
          <div className="relative group">
            <img
              src={plant.photo_url}
              alt={plant.custom_name || plant.plant_name}
              className="w-full h-40 sm:h-48 object-cover rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 backdrop-blur-sm shadow-md">
              <Camera className="h-4 w-4 text-green-600" />
            </div>
          </div>
        ) : (
          <div className="w-full h-40 sm:h-48 garden-gradient rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden border-2 border-green-200">
            <div className="text-5xl sm:text-6xl animate-gentle-float drop-shadow-lg">{getPlantEmoji()}</div>
            <div className="absolute inset-0 leaf-pattern opacity-40" />
          </div>
        )}
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-green-700 p-2 bg-green-50 rounded-lg">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate font-medium">Last: {format(parseISO(plant.last_watered), 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-blue-600 p-2 bg-blue-50 rounded-lg">
            <Droplets className="h-4 w-4 flex-shrink-0" />
            <span className="truncate font-medium">Next: {format(parseISO(plant.next_water_date), 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="text-green-600 font-medium flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>Every {plant.watering_interval_days} day{plant.watering_interval_days === 1 ? '' : 's'}</span>
          </div>

          {wasRecentlyWatered && (
            <div className="flex items-center gap-2 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200 shadow-inner">
              <CheckCircle className="h-5 w-5 text-green-600 animate-pulse" />
              <span className="text-sm font-semibold">
                {plant.last_watered_timestamp ? 
                  `💧 Watered today at ${new Date(plant.last_watered_timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` :
                  '💧 Watered today ✅'
                }
              </span>
            </div>
          )}
        </div>

        {/* Plant Fact */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200">
          <p className="text-sm text-orange-700 font-medium text-center">{currentFact}</p>
        </div>

        {actions && (
          <div className="flex gap-3 pt-2">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
