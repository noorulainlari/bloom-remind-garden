
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Droplets, Trash2, Calendar, CheckCircle, Camera } from 'lucide-react';
import { format, parseISO, isToday, isPast, addDays } from 'date-fns';

interface UserPlant {
  id: string;
  plant_name: string;
  scientific_name: string;
  watering_interval_days: number;
  last_watered: string;
  next_water_date: string;
  photo_url: string;
  user_id?: string;
  last_watered_timestamp?: string | null;
}

interface PlantListProps {
  refreshTrigger: number;
}

export const PlantList = ({ refreshTrigger }: PlantListProps) => {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(false);
  const [wateredPlants, setWateredPlants] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPlants();
  }, [refreshTrigger, user]);

  const loadPlants = async () => {
    setLoading(true);
    
    if (user) {
      // Load plants from Supabase for logged-in users
      const { data, error } = await supabase
        .from('user_plants')
        .select('*')
        .eq('user_id', user.id)
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
    } else {
      // Load plants from localStorage for guests
      const localPlantsData = localStorage.getItem('localPlants');
      if (localPlantsData) {
        try {
          const localPlants = JSON.parse(localPlantsData);
          setPlants(localPlants);
        } catch (error) {
          console.error('Error parsing local plants:', error);
          localStorage.removeItem('localPlants');
          setPlants([]);
        }
      } else {
        setPlants([]);
      }
    }
    
    setLoading(false);
  };

  const markAsWatered = async (plantId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    if (user) {
      // Update in Supabase for logged-in users
      const { error: updateError } = await supabase
        .from('user_plants')
        .update({ 
          last_watered: today,
          last_watered_timestamp: now.toISOString()
        })
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
    } else {
      // Update in localStorage for guests
      const localPlantsData = localStorage.getItem('localPlants');
      if (localPlantsData) {
        try {
          const localPlants = JSON.parse(localPlantsData);
          const updatedPlants = localPlants.map((plant: UserPlant) => {
            if (plant.id === plantId) {
              const nextWaterDate = addDays(new Date(today), plant.watering_interval_days);
              return {
                ...plant,
                last_watered: today,
                last_watered_timestamp: now.toISOString(),
                next_water_date: nextWaterDate.toISOString().split('T')[0]
              };
            }
            return plant;
          });
          localStorage.setItem('localPlants', JSON.stringify(updatedPlants));
        } catch (error) {
          console.error('Error updating local plants:', error);
        }
      }
    }

    // Add to watered plants for visual feedback
    setWateredPlants(prev => new Set([...prev, plantId]));

    toast({
      title: "🌱 Plant Watered!",
      description: `Watered today at ${timestamp}`,
    });
    
    // Remove visual feedback after 5 seconds
    setTimeout(() => {
      setWateredPlants(prev => {
        const newSet = new Set(prev);
        newSet.delete(plantId);
        return newSet;
      });
    }, 5000);
    
    loadPlants();
  };

  const removePlant = async (plantId: string, photoUrl?: string) => {
    if (user) {
      // Remove from Supabase for logged-in users
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

      // Delete photo from storage if exists and it's not base64
      if (photoUrl && !photoUrl.startsWith('data:')) {
        const path = photoUrl.split('/').pop();
        if (path) {
          await supabase.storage
            .from('plant-photos')
            .remove([`plant-photos/${path}`]);
        }
      }
    } else {
      // Remove from localStorage for guests
      const localPlantsData = localStorage.getItem('localPlants');
      if (localPlantsData) {
        try {
          const localPlants = JSON.parse(localPlantsData);
          const updatedPlants = localPlants.filter((plant: UserPlant) => plant.id !== plantId);
          localStorage.setItem('localPlants', JSON.stringify(updatedPlants));
        } catch (error) {
          console.error('Error removing local plant:', error);
        }
      }
    }

    toast({
      title: "🗑️ Plant Removed",
      description: "Plant has been removed from your collection.",
    });
    
    loadPlants();
  };

  const getWaterStatus = (nextWaterDate: string) => {
    const date = parseISO(nextWaterDate);
    if (isToday(date)) {
      return { text: '💧 Water Today', variant: 'default' as const, urgent: true };
    } else if (isPast(date)) {
      return { text: '🚨 Overdue', variant: 'destructive' as const, urgent: true };
    } else {
      const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return { text: `💧 Water in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`, variant: 'secondary' as const, urgent: false };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 text-green-600">
          <div className="animate-spin">🌱</div>
          <span>Loading your garden...</span>
        </div>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-green-700 mb-4 text-lg font-medium">No plants in your garden yet!</p>
          <p className="text-sm text-green-600">Add your first plant above to start your garden journey.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800">🌿 Your Plant Collection</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {plants.length} plant{plants.length === 1 ? '' : 's'}
        </Badge>
      </div>
      
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => {
          const waterStatus = getWaterStatus(plant.next_water_date);
          const isWatered = wateredPlants.has(plant.id);
          const wasRecentlyWatered = plant.last_watered_timestamp && 
            new Date(plant.last_watered_timestamp).toDateString() === new Date().toDateString();
          
          return (
            <Card 
              key={plant.id} 
              className={`transition-all duration-300 shadow-lg hover:shadow-xl ${
                waterStatus.urgent ? 'ring-2 ring-orange-300 shadow-orange-100' : 'border-green-200'
              } ${
                isWatered || wasRecentlyWatered ? 'bg-gradient-to-br from-green-100 to-green-50 ring-2 ring-green-300' : 'bg-white'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl text-green-800 truncate">{plant.plant_name}</CardTitle>
                    {plant.scientific_name && (
                      <p className="text-sm text-green-600 italic truncate">{plant.scientific_name}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant={waterStatus.variant} className="text-xs whitespace-nowrap">
                      {waterStatus.text}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {plant.photo_url ? (
                  <div className="relative">
                    <img
                      src={plant.photo_url}
                      alt={plant.plant_name}
                      className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                      <Camera className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center shadow-inner">
                    <span className="text-4xl sm:text-5xl">🌱</span>
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
                  
                  <div className="text-green-600 font-medium">
                    💧 Every {plant.watering_interval_days} day{plant.watering_interval_days === 1 ? '' : 's'}
                  </div>

                  {(isWatered || wasRecentlyWatered) && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-100 p-2 rounded-lg">
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
                    onClick={() => markAsWatered(plant.id)}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    disabled={isWatered}
                  >
                    {isWatered ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Watered!
                      </>
                    ) : (
                      <>
                        <Droplets className="h-4 w-4 mr-1" />
                        Mark as Watered
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => removePlant(plant.id, plant.photo_url)}
                    size="sm"
                    variant="destructive"
                    className="flex-shrink-0"
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
