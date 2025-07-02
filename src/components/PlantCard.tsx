
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Share2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickWaterButton } from './QuickWaterButton';
import { PlantTooltips } from './PlantTooltips';
import { PlantStatus } from './plant/PlantStatus';
import { PlantImage } from './plant/PlantImage';
import { PlantInfo } from './plant/PlantInfo';

interface Plant {
  id: string;
  plant_name: string;
  scientific_name?: string;
  watering_interval_days: number;
  last_watered?: string;
  next_water_date: string;
  photo_url?: string;
  custom_name?: string;
  last_watered_timestamp?: string | null;
}

interface PlantCardProps {
  plant: Plant;
  onUpdate?: () => void;
  onDelete?: (plantId: string) => void;
  actions?: React.ReactNode;
}

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

export const PlantCard = ({ plant, onUpdate, onDelete, actions }: PlantCardProps) => {
  const [currentFact] = useState(PLANT_FACTS[Math.floor(Math.random() * PLANT_FACTS.length)]);
  
  const wasRecentlyWatered = plant.last_watered_timestamp && 
    new Date(plant.last_watered_timestamp).toDateString() === new Date().toDateString();

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
      const shareText = `My ${plant.custom_name || plant.plant_name} - I water it every ${plant.watering_interval_days} days! 🌱`;
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <Card className="transition-all duration-500 shadow-xl hover:shadow-2xl plant-card transform hover:scale-102 rounded-2xl overflow-hidden backdrop-blur-sm border-2 border-green-200">
      <CardHeader className="pb-4 relative bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="text-3xl animate-gentle-float drop-shadow-sm">{getPlantEmoji()}</div>
          <PlantTooltips.PhotoUpload>
            <Button
              onClick={handleShare}
              size="sm"
              variant="ghost"
              className="text-green-600 hover:text-green-700 hover:bg-green-100 p-2 h-9 w-9 rounded-full"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </PlantTooltips.PhotoUpload>
        </div>
        
        <div className="flex justify-between items-start gap-2 pr-24">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl sm:text-2xl text-green-800 truncate flex items-center gap-3 font-bold mb-2">
              <Leaf className="h-6 w-6 text-green-600 animate-leaf-sway" />
              {plant.custom_name || plant.plant_name}
            </CardTitle>
            {plant.scientific_name && (
              <p className="text-base text-green-600 italic truncate font-semibold">{plant.scientific_name}</p>
            )}
          </div>
        </div>

        <PlantStatus 
          nextWaterDate={plant.next_water_date}
          wateringIntervalDays={plant.watering_interval_days}
        />
      </CardHeader>
      
      <CardContent className="space-y-5 p-6">
        <PlantImage 
          photoUrl={plant.photo_url}
          plantName={plant.custom_name || plant.plant_name}
          plantEmoji={getPlantEmoji()}
        />
        
        <PlantInfo
          lastWatered={plant.last_watered}
          nextWaterDate={plant.next_water_date}
          wateringIntervalDays={plant.watering_interval_days}
        />

        {wasRecentlyWatered && (
          <div className="flex items-center gap-3 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300 shadow-inner">
            <CheckCircle className="h-6 w-6 text-green-600 animate-pulse" />
            <span className="text-base font-bold">
              {plant.last_watered_timestamp ? 
                `💧 Watered today at ${new Date(plant.last_watered_timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` :
                '💧 Watered today ✅'
              }
            </span>
          </div>
        )}

        {/* Plant Fact */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200">
          <p className="text-base text-orange-700 font-bold text-center">{currentFact}</p>
        </div>

        {/* Quick Water Button */}
        <div className="flex justify-center pt-2">
          <QuickWaterButton
            plantId={plant.id}
            plantName={plant.custom_name || plant.plant_name}
            wateringIntervalDays={plant.watering_interval_days}
            onUpdate={onUpdate}
            className="px-6 py-3 text-lg"
          />
        </div>

        {actions && (
          <div className="flex gap-4 pt-2">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
