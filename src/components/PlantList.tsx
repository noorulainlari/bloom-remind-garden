
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlantCard } from './PlantCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Plant {
  id: string;
  plant_name: string;
  scientific_name?: string;
  custom_name?: string;
  watering_interval_days: number;
  next_water_date: string;
  last_watered?: string;
  photo_url?: string;
  status?: string;
  user_id?: string;
  created_at?: string;
}

interface PlantListProps {
  refreshTrigger?: number;
}

export const PlantList = ({ refreshTrigger }: PlantListProps) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPlants();
  }, [user, refreshTrigger]);

  const loadPlants = async () => {
    setLoading(true);
    
    try {
      let allPlants: Plant[] = [];

      if (user) {
        // Load from database if user is logged in
        const { data, error } = await supabase
          .from('user_plants')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading plants:', error);
        } else {
          allPlants = data || [];
        }
      } else {
        // Load from local storage if no user
        const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
        allPlants = localPlants;
      }

      setPlants(allPlants);
    } catch (error) {
      console.error('Error loading plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlantUpdate = async (plantId: string, updates: Partial<Plant>) => {
    if (user) {
      // Update in database
      const { error } = await supabase
        .from('user_plants')
        .update(updates)
        .eq('id', plantId);

      if (error) {
        console.error('Error updating plant:', error);
        return;
      }
    } else {
      // Update in local storage
      const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
      const updatedPlants = localPlants.map((plant: Plant) => 
        plant.id === plantId ? { ...plant, ...updates } : plant
      );
      localStorage.setItem('localPlants', JSON.stringify(updatedPlants));
    }

    // Refresh the plant list
    loadPlants();
  };

  const handlePlantDelete = async (plantId: string) => {
    if (user) {
      // Delete from database
      const { error } = await supabase
        .from('user_plants')
        .delete()
        .eq('id', plantId);

      if (error) {
        console.error('Error deleting plant:', error);
        return;
      }
    } else {
      // Delete from local storage
      const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
      const filteredPlants = localPlants.filter((plant: Plant) => plant.id !== plantId);
      localStorage.setItem('localPlants', JSON.stringify(filteredPlants));
    }

    // Refresh the plant list
    loadPlants();
  };

  if (loading) {
    return (
      <Card className="plant-card">
        <CardContent className="p-6">
          <div className="text-center text-green-600">
            Loading your plants...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (plants.length === 0) {
    return (
      <Card className="plant-card">
        <CardHeader>
          <CardTitle className="text-green-800 text-center">🌱 Your Plant Garden</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-green-600">
            <p className="text-lg mb-2">No plants in your garden yet!</p>
            <p className="text-sm">Add your first plant above to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          🌿 Your Plant Garden ({plants.length})
        </CardTitle>
        {!user && plants.length > 0 && (
          <p className="text-sm text-green-600">
            Plants saved locally. Sign in to sync across devices!
          </p>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onUpdate={() => loadPlants()}
              onDelete={handlePlantDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
