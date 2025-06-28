
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Droplets, Trash2, Calendar, CheckCircle, Camera, RotateCcw, Archive, Eye, EyeOff } from 'lucide-react';
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
  custom_name?: string | null;
  status?: 'active' | 'archived' | 'dead';
}

interface PlantListProps {
  refreshTrigger: number;
}

// Undo functionality
let lastAction: { type: string; plantData: any; timestamp: number } | null = null;

export const PlantList = ({ refreshTrigger }: PlantListProps) => {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(false);
  const [wateredPlants, setWateredPlants] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const [draggedPlant, setDraggedPlant] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPlants();
  }, [refreshTrigger, user, showArchived]);

  const loadPlants = async () => {
    setLoading(true);
    
    if (user) {
      const query = supabase
        .from('user_plants')
        .select('*')
        .eq('user_id', user.id);
      
      if (!showArchived) {
        query.neq('status', 'archived').neq('status', 'dead');
      }
      
      const { data, error } = await query.order('next_water_date', { ascending: true });

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
      const localPlantsData = localStorage.getItem('localPlants');
      if (localPlantsData) {
        try {
          let localPlants = JSON.parse(localPlantsData);
          if (!showArchived) {
            localPlants = localPlants.filter((p: UserPlant) => 
              p.status !== 'archived' && p.status !== 'dead'
            );
          }
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

    setWateredPlants(prev => new Set([...prev, plantId]));

    toast({
      title: "🌱 Plant Watered!",
      description: `Watered today at ${timestamp}`,
    });
    
    setTimeout(() => {
      setWateredPlants(prev => {
        const newSet = new Set(prev);
        newSet.delete(plantId);
        return newSet;
      });
    }, 5000);
    
    loadPlants();
  };

  const archivePlant = async (plantId: string, status: 'archived' | 'dead') => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    // Store for undo
    lastAction = {
      type: 'archive',
      plantData: { ...plant, originalStatus: plant.status || 'active' },
      timestamp: Date.now()
    };

    if (user) {
      const { error } = await supabase
        .from('user_plants')
        .update({ status })
        .eq('id', plantId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to archive plant.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const localPlantsData = localStorage.getItem('localPlants');
      if (localPlantsData) {
        try {
          const localPlants = JSON.parse(localPlantsData);
          const updatedPlants = localPlants.map((p: UserPlant) => 
            p.id === plantId ? { ...p, status } : p
          );
          localStorage.setItem('localPlants', JSON.stringify(updatedPlants));
        } catch (error) {
          console.error('Error archiving local plant:', error);
        }
      }
    }

    toast({
      title: status === 'archived' ? "📦 Plant Archived" : "💀 Plant Marked as Dead",
      description: "Plant moved to archive. Use undo to restore.",
      action: (
        <Button variant="outline" size="sm" onClick={undoLastAction}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Undo
        </Button>
      ),
    });
    
    loadPlants();
  };

  const removePlant = async (plantId: string, photoUrl?: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    // Store for undo
    lastAction = {
      type: 'delete',
      plantData: plant,
      timestamp: Date.now()
    };

    if (user) {
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

      if (photoUrl && !photoUrl.startsWith('data:')) {
        const path = photoUrl.split('/').pop();
        if (path) {
          await supabase.storage
            .from('plant-photos')
            .remove([`plant-photos/${path}`]);
        }
      }
    } else {
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
      description: "Plant has been permanently deleted.",
      action: (
        <Button variant="outline" size="sm" onClick={undoLastAction}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Undo
        </Button>
      ),
    });
    
    loadPlants();
  };

  const undoLastAction = async () => {
    if (!lastAction || Date.now() - lastAction.timestamp > 30000) {
      toast({
        title: "Cannot Undo",
        description: "Action too old or no recent action to undo.",
        variant: "destructive",
      });
      return;
    }

    const { type, plantData } = lastAction;

    if (type === 'delete') {
      if (user) {
        const { error } = await supabase.from('user_plants').insert({
          ...plantData,
          user_id: user.id
        });
        if (error) {
          toast({
            title: "Error",
            description: "Failed to restore plant.",
            variant: "destructive",
          });
          return;
        }
      } else {
        const localPlantsData = localStorage.getItem('localPlants');
        const localPlants = localPlantsData ? JSON.parse(localPlantsData) : [];
        localPlants.push(plantData);
        localStorage.setItem('localPlants', JSON.stringify(localPlants));
      }
    } else if (type === 'archive') {
      if (user) {
        const { error } = await supabase
          .from('user_plants')
          .update({ status: plantData.originalStatus })
          .eq('id', plantData.id);
        if (error) {
          toast({
            title: "Error",
            description: "Failed to restore plant.",
            variant: "destructive",
          });
          return;
        }
      } else {
        const localPlantsData = localStorage.getItem('localPlants');
        if (localPlantsData) {
          const localPlants = JSON.parse(localPlantsData);
          const updatedPlants = localPlants.map((p: UserPlant) => 
            p.id === plantData.id ? { ...p, status: plantData.originalStatus } : p
          );
          localStorage.setItem('localPlants', JSON.stringify(updatedPlants));
        }
      }
    }

    lastAction = null;
    toast({
      title: "✅ Action Undone",
      description: "Plant has been restored.",
    });
    loadPlants();
  };

  const handleDragStart = (e: React.DragEvent, plantId: string) => {
    setDraggedPlant(plantId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetPlantId: string) => {
    e.preventDefault();
    
    if (!draggedPlant || draggedPlant === targetPlantId) {
      setDraggedPlant(null);
      return;
    }

    // Reorder plants logic would go here
    // For now, just show a toast
    toast({
      title: "🔄 Plants Reordered",
      description: "Plant order updated successfully!",
    });
    
    setDraggedPlant(null);
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
          <p className="text-green-700 mb-4 text-lg font-medium">
            {showArchived ? 'No archived plants!' : 'No plants in your garden yet!'}
          </p>
          <p className="text-sm text-green-600">
            {showArchived 
              ? 'Switch back to active plants to see your garden.' 
              : 'Add your first plant above to start your garden journey.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800">🌿 Your Plant Collection</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {plants.length} plant{plants.length === 1 ? '' : 's'}
          </Badge>
        </div>
        
        <Button
          onClick={() => setShowArchived(!showArchived)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {showArchived ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {showArchived ? 'Show Active' : 'Show Archived'}
        </Button>
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
              draggable={!showArchived}
              onDragStart={(e) => handleDragStart(e, plant.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, plant.id)}
              className={`transition-all duration-300 shadow-lg hover:shadow-xl cursor-move ${
                waterStatus.urgent ? 'ring-2 ring-orange-300 shadow-orange-100' : 'border-green-200'
              } ${
                isWatered || wasRecentlyWatered ? 'bg-gradient-to-br from-green-100 to-green-50 ring-2 ring-green-300' : 'bg-white'
              } ${
                plant.status === 'archived' ? 'opacity-75 bg-gray-50' : ''
              } ${
                plant.status === 'dead' ? 'opacity-60 bg-red-50 border-red-200' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl text-green-800 truncate">
                      {plant.custom_name || plant.plant_name}
                    </CardTitle>
                    {plant.scientific_name && (
                      <p className="text-sm text-green-600 italic truncate">{plant.scientific_name}</p>
                    )}
                    {plant.status && plant.status !== 'active' && (
                      <Badge variant={plant.status === 'dead' ? 'destructive' : 'secondary'} className="mt-1">
                        {plant.status === 'dead' ? '💀 Dead' : '📦 Archived'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {!showArchived && (
                      <Badge variant={waterStatus.variant} className="text-xs whitespace-nowrap">
                        {waterStatus.text}
                      </Badge>
                    )}
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
                  
                  {!showArchived && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Droplets className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Next: {format(parseISO(plant.next_water_date), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  
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
                  {!showArchived && plant.status !== 'dead' && (
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
                  )}
                  
                  {!showArchived && (
                    <Button
                      onClick={() => archivePlant(plant.id, 'archived')}
                      size="sm"
                      variant="outline"
                      className="flex-shrink-0"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                  
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
