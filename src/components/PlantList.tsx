
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PlantCard } from './PlantCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Archive, Undo2, Copy, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Plant {
  id: string;
  plant_name: string;
  scientific_name?: string;
  custom_name?: string;
  watering_interval_days: number;
  last_watered?: string;
  next_water_date: string;
  photo_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  last_watered_timestamp?: string;
}

interface PlantListProps {
  refreshTrigger: number;
}

export const PlantList = ({ refreshTrigger }: PlantListProps) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [archivedPlants, setArchivedPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('next_water_date');
  const [lastAction, setLastAction] = useState<{type: string, plant: Plant} | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadPlants = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load active plants
      const { data: activePlants, error: activeError } = await supabase
        .from('user_plants')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Load archived plants
      const { data: archived, error: archivedError } = await supabase
        .from('user_plants')
        .select('*')
        .eq('user_id', user.id) 
        .eq('status', 'archived')
        .order('updated_at', { ascending: false });

      if (activeError) throw activeError;
      if (archivedError) throw archivedError;

      setPlants(activePlants || []);
      setArchivedPlants(archived || []);
    } catch (error) {
      console.error('Error loading plants:', error);
      toast({
        title: "Error",
        description: "Failed to load plants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, [user, refreshTrigger]);

  const archivePlant = async (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    try {
      const { error } = await supabase
        .from('user_plants')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', plantId);

      if (error) throw error;

      setLastAction({ type: 'archive', plant });
      toast({
        title: "🗄️ Plant Archived",
        description: `${plant.custom_name || plant.plant_name} has been archived`,
      });

      loadPlants();
    } catch (error) {
      console.error('Error archiving plant:', error);
      toast({
        title: "Error",
        description: "Failed to archive plant",
        variant: "destructive",
      });
    }
  };

  const restorePlant = async (plantId: string) => {
    try {
      const { error } = await supabase
        .from('user_plants')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', plantId);

      if (error) throw error;

      toast({
        title: "🌱 Plant Restored",
        description: "Plant has been restored to your active collection",
      });

      loadPlants();
    } catch (error) {
      console.error('Error restoring plant:', error);
      toast({
        title: "Error",
        description: "Failed to restore plant",
        variant: "destructive",
      });
    }
  };

  const undoLastAction = async () => {
    if (!lastAction) return;

    if (lastAction.type === 'archive') {
      await restorePlant(lastAction.plant.id);
      setLastAction(null);
    }
  };

  const duplicatePlant = async (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant || !user) return;

    try {
      const { error } = await supabase
        .from('user_plants')
        .insert({
          user_id: user.id,
          plant_name: plant.plant_name,
          scientific_name: plant.scientific_name || null,
          custom_name: `${plant.custom_name || plant.plant_name} (Copy)`,
          watering_interval_days: plant.watering_interval_days,
          next_water_date: new Date().toISOString().split('T')[0],
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "🌱 Plant Duplicated",
        description: `Created a copy of ${plant.custom_name || plant.plant_name}`,
      });

      loadPlants();
    } catch (error) {
      console.error('Error duplicating plant:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate plant",
        variant: "destructive",
      });
    }
  };

  const filteredPlants = plants
    .filter(plant => 
      (plant.custom_name || plant.plant_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plant.scientific_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.custom_name || a.plant_name).localeCompare(b.custom_name || b.plant_name);
        case 'next_water_date':
          return new Date(a.next_water_date).getTime() - new Date(b.next_water_date).getTime();
        case 'created_at':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredPlants);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlants(items);
    // Note: In a real app, you'd save the new order to the database
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="plant-card">
        <CardContent className="text-center py-8">
          <p className="text-green-600">Please sign in to view your plants.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="plant-card shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-green-800">
              Your Plant Collection ({plants.length})
            </CardTitle>
            
            <div className="flex gap-2">
              {lastAction && (
                <Button
                  onClick={undoLastAction}
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  Undo
                </Button>
              )}
              
              <Button
                onClick={() => setShowArchived(!showArchived)}
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300"
              >
                <Archive className="h-4 w-4 mr-1" />
                {showArchived ? 'Hide' : 'Show'} Archived ({archivedPlants.length})
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <Input
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next_water_date">Next Watering</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="created_at">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {!showArchived ? (
            // Active Plants
            <>
              {filteredPlants.length === 0 ? (
                <div className="text-center py-8 text-green-600">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-xl font-semibold mb-2">No plants yet!</p>
                  <p>Add your first plant to get started with your garden.</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="plants">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                      >
                        {filteredPlants.map((plant, index) => (
                          <Draggable
                            key={plant.id}
                            draggableId={plant.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`relative ${snapshot.isDragging ? 'rotate-2 scale-105' : ''}`}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded cursor-grab hover:bg-white"
                                >
                                  <GripVertical className="h-4 w-4 text-gray-500" />
                                </div>
                                
                                <PlantCard
                                  plant={plant}
                                  onUpdate={loadPlants}
                                  actions={
                                    <div className="flex gap-1">
                                      <Button
                                        onClick={() => duplicatePlant(plant.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:text-blue-800"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        onClick={() => archivePlant(plant.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Archive className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </>
          ) : (
            // Archived Plants
            <>
              {archivedPlants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Archive className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No archived plants</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {archivedPlants.map((plant) => (
                    <div key={plant.id} className="relative opacity-75">
                      <PlantCard
                        plant={plant}
                        onUpdate={loadPlants}
                        actions={
                          <Button
                            onClick={() => restorePlant(plant.id)}
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded text-xs">
                        Archived
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
