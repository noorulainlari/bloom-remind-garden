
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Droplets, Trash2, Calendar } from 'lucide-react';
import { format, parseISO, isToday, isPast } from 'date-fns';

interface UserPlant {
  id: string;
  plant_name: string;
  scientific_name: string;
  watering_interval_days: number;
  last_watered: string;
  next_water_date: string;
  photo_url: string;
}

interface PlantListProps {
  refreshTrigger: number;
}

export const PlantList = ({ refreshTrigger }: PlantListProps) => {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlants();
  }, [refreshTrigger]);

  const loadPlants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_plants')
      .select('*')
      .order('next_water_date', { ascending: true });

    if (error) {
      console.error('Error loading plants:', error);
      toast({
        title: "Error",
        description: "Failed to load your plants.",
        variant: "destructive",
      });
    } else {
      setPlants(data || []);
    }
    setLoading(false);
  };

  const markAsWatered = async (plantId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { error: updateError } = await supabase
      .from('user_plants')
      .update({ last_watered: today })
      .eq('id', plantId);

    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to update watering date.",
        variant: "destructive",
      });
      return;
    }

    // Add to watering log
    const { error: logError } = await supabase
      .from('watering_logs')
      .insert({
        plant_id: plantId,
        watered_date: today,
      });

    if (logError) {
      console.error('Error adding to watering log:', logError);
    }

    toast({
      title: "Plant Watered!",
      description: "Watering date updated successfully.",
    });
    
    loadPlants();
  };

  const removePlant = async (plantId: string, photoUrl?: string) => {
    const { error } = await supabase
      .from('user_plants')
      .delete()
      .eq('id', plantId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove plant.",
        variant: "destructive",
      });
      return;
    }

    // Delete photo from storage if exists
    if (photoUrl) {
      const path = photoUrl.split('/').pop();
      if (path) {
        await supabase.storage
          .from('plant-photos')
          .remove([`plant-photos/${path}`]);
      }
    }

    toast({
      title: "Plant Removed",
      description: "Plant has been removed from your collection.",
    });
    
    loadPlants();
  };

  const getWaterStatus = (nextWaterDate: string) => {
    const date = parseISO(nextWaterDate);
    if (isToday(date)) {
      return { text: 'Water Today', variant: 'default' as const, urgent: true };
    } else if (isPast(date)) {
      return { text: 'Overdue', variant: 'destructive' as const, urgent: true };
    } else {
      return { text: `Water in ${Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`, variant: 'secondary' as const, urgent: false };
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your plants...</div>;
  }

  if (plants.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 mb-4">No plants added yet!</p>
          <p className="text-sm text-gray-400">Add your first plant above to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-green-700">Your Plant Collection</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => {
          const waterStatus = getWaterStatus(plant.next_water_date);
          return (
            <Card key={plant.id} className={`${waterStatus.urgent ? 'ring-2 ring-orange-200' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{plant.plant_name}</CardTitle>
                    {plant.scientific_name && (
                      <p className="text-sm text-gray-500 italic">{plant.scientific_name}</p>
                    )}
                  </div>
                  <Badge variant={waterStatus.variant}>
                    {waterStatus.text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plant.photo_url ? (
                  <img
                    src={plant.photo_url}
                    alt={plant.plant_name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-32 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 text-4xl">🌱</span>
                  </div>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Last watered: {format(parseISO(plant.last_watered), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Next: {format(parseISO(plant.next_water_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="text-gray-600">
                    Water every {plant.watering_interval_days} days
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => markAsWatered(plant.id)}
                    size="sm"
                    className="flex-1"
                  >
                    <Droplets className="h-4 w-4 mr-1" />
                    Mark as Watered
                  </Button>
                  <Button
                    onClick={() => removePlant(plant.id, plant.photo_url)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
