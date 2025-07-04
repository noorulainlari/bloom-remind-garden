
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, CheckCircle } from 'lucide-react';
import { PlantTooltips } from './PlantTooltips';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { addDays } from 'date-fns';

interface QuickWaterButtonProps {
  plantId: string;
  plantName: string;
  wateringIntervalDays: number;
  onUpdate?: () => void;
  className?: string;
}

export const QuickWaterButton = ({ 
  plantId, 
  plantName, 
  wateringIntervalDays, 
  onUpdate,
  className = "" 
}: QuickWaterButtonProps) => {
  const [isWatering, setIsWatering] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleQuickWater = async () => {
    setIsWatering(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const nextWaterDate = addDays(new Date(today), wateringIntervalDays);
      const timestamp = new Date().toISOString();

      if (user) {
        // Update in database for authenticated users
        const { error } = await supabase
          .from('user_plants')
          .update({
            last_watered: today,
            next_water_date: nextWaterDate.toISOString().split('T')[0],
            last_watered_timestamp: timestamp
          })
          .eq('id', plantId);

        if (error) {
          console.error('Database update error:', error);
          toast({
            title: "Error",
            description: "Failed to update watering record in database.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Update in local storage for non-authenticated users
        const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
        const updatedPlants = localPlants.map((plant: any) => 
          plant.id === plantId ? {
            ...plant,
            last_watered: today,
            next_water_date: nextWaterDate.toISOString().split('T')[0],
            last_watered_timestamp: timestamp
          } : plant
        );
        localStorage.setItem('localPlants', JSON.stringify(updatedPlants));
      }

      toast({
        title: "💧 Plant Watered!",
        description: `${plantName} has been watered successfully. Next watering in ${wateringIntervalDays} days.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });

      onUpdate?.();
    } catch (error) {
      console.error('Error updating plant:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWatering(false);
    }
  };

  return (
    <PlantTooltips.WaterNow>
      <Button
        onClick={handleQuickWater}
        disabled={isWatering}
        className={`garden-button font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${className}`}
        size="sm"
      >
        {isWatering ? (
          <>
            <CheckCircle className="h-5 w-5 mr-2 animate-pulse" />
            Watering...
          </>
        ) : (
          <>
            <Droplets className="h-5 w-5 mr-2" />
            💧 Water Now
          </>
        )}
      </Button>
    </PlantTooltips.WaterNow>
  );
};
