
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Check, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Plant {
  id: string;
  name: string;
  scientific_name?: string;
  watering_interval_days: number;
}

interface ImprovedPlantSelectorProps {
  onPlantAdded?: () => void;
}

export const ImprovedPlantSelector = ({ onPlantAdded }: ImprovedPlantSelectorProps) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [customName, setCustomName] = useState('');
  const [isCustomPlant, setIsCustomPlant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load plants from database
  useEffect(() => {
    const loadPlants = async () => {
      const { data, error } = await supabase
        .from('plant_species')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error loading plants:', error);
        return;
      }
      
      setPlants(data || []);
    };
    
    loadPlants();
  }, []);

  // Filter plants based on search term
  const filteredPlants = useMemo(() => {
    if (!searchTerm) return plants.slice(0, 8); // Show top 8 by default
    
    return plants.filter(plant =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plant.scientific_name && plant.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 10);
  }, [plants, searchTerm]);

  // Determine if we should show "Add Custom Plant" option
  const shouldShowCustomOption = useMemo(() => {
    if (!searchTerm) return false;
    
    const exactMatch = plants.some(plant =>
      plant.name.toLowerCase() === searchTerm.toLowerCase()
    );
    
    return !exactMatch && searchTerm.length > 2;
  }, [plants, searchTerm]);

  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant);
    setIsCustomPlant(false);
    setCustomName('');
  };

  const handleCustomPlantSelect = () => {
    setSelectedPlant(null);
    setIsCustomPlant(true);
    setCustomName(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (filteredPlants.length > 0) {
        handlePlantSelect(filteredPlants[0]);
      } else if (shouldShowCustomOption) {
        handleCustomPlantSelect();
      }
    }
  };

  const getDifficultyLevel = (wateringDays: number) => {
    if (wateringDays <= 3) return { level: 'High Care', color: 'bg-red-100 text-red-800' };
    if (wateringDays <= 7) return { level: 'Medium Care', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Easy Care', color: 'bg-green-100 text-green-800' };
  };

  // Save plant locally if no user, otherwise save to database
  const saveToLocalStorage = (plantData: any) => {
    const existingPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
    const newPlant = {
      ...plantData,
      id: Date.now().toString(), // Simple ID for local storage
      created_at: new Date().toISOString(),
    };
    existingPlants.push(newPlant);
    localStorage.setItem('localPlants', JSON.stringify(existingPlants));
    return newPlant;
  };

  const addPlantToGarden = async () => {
    if (!selectedPlant && !isCustomPlant) {
      toast({
        title: "No plant selected",
        description: "Please select a plant or create a custom one",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const plantData = {
        plant_name: isCustomPlant ? customName : selectedPlant!.name,
        scientific_name: isCustomPlant ? null : selectedPlant!.scientific_name,
        custom_name: customName || null,
        watering_interval_days: isCustomPlant ? 7 : selectedPlant!.watering_interval_days,
        next_water_date: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      if (user) {
        // Save to database if user is logged in
        const { error } = await supabase
          .from('user_plants')
          .insert({
            ...plantData,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: "🌱 Plant Added!",
          description: `${plantData.plant_name} has been added to your garden and synced to your account`,
        });
      } else {
        // Save to local storage if no user
        saveToLocalStorage(plantData);
        
        toast({
          title: "🌱 Plant Added Locally!",
          description: `${plantData.plant_name} has been saved locally. Sign in to sync across devices!`,
        });
      }

      // Reset form
      setSelectedPlant(null);
      setIsCustomPlant(false);
      setCustomName('');
      setSearchTerm('');

      if (onPlantAdded) {
        onPlantAdded();
      }
    } catch (error) {
      console.error('Error adding plant:', error);
      toast({
        title: "Error",
        description: "Failed to add plant to your garden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="🌱 Start typing to search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 text-lg py-6 border-2 border-green-200 focus:border-green-400"
        />
      </div>

      {/* Plant Suggestions */}
      {(filteredPlants.length > 0 || shouldShowCustomOption) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">
            {searchTerm ? 'Search Results' : 'Popular Plants'}
          </h3>
          
          <div className="grid gap-3 max-h-64 overflow-y-auto">
            {filteredPlants.map((plant) => {
              const difficulty = getDifficultyLevel(plant.watering_interval_days);
              const isSelected = selectedPlant?.id === plant.id;
              
              return (
                <Card
                  key={plant.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}
                  onClick={() => handlePlantSelect(plant)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-green-800">{plant.name}</h4>
                          {isSelected && <Check className="h-5 w-5 text-green-600" />}
                        </div>
                        {plant.scientific_name && (
                          <p className="text-sm text-gray-600 italic">{plant.scientific_name}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Water every {plant.watering_interval_days} day{plant.watering_interval_days === 1 ? '' : 's'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={difficulty.color}>
                          {difficulty.level}
                        </Badge>
                        {plant.watering_interval_days >= 14 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs text-gray-500">Beginner</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Custom Plant Option */}
            {shouldShowCustomOption && (
              <Card
                className={`cursor-pointer transition-all hover:shadow-md border-dashed border-2 ${
                  isCustomPlant ? 'ring-2 ring-green-500 bg-green-50' : 'border-green-300'
                }`}
                onClick={handleCustomPlantSelect}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Plus className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        Add "{searchTerm}" as custom plant
                      </h4>
                      <p className="text-sm text-gray-500">Create your own plant entry</p>
                    </div>
                    {isCustomPlant && <Check className="h-5 w-5 text-green-600 ml-auto" />}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Selected Plant Details */}
      {(selectedPlant || isCustomPlant) && (
        <Card className="border-2 border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Selected Plant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlant && (
              <div>
                <h3 className="font-bold text-lg text-green-800">{selectedPlant.name}</h3>
                {selectedPlant.scientific_name && (
                  <p className="text-sm text-gray-600 italic">{selectedPlant.scientific_name}</p>
                )}
                <p className="text-sm text-gray-700 mt-2">
                  🌊 Water every {selectedPlant.watering_interval_days} day{selectedPlant.watering_interval_days === 1 ? '' : 's'}
                </p>
                <Badge className={getDifficultyLevel(selectedPlant.watering_interval_days).color}>
                  {getDifficultyLevel(selectedPlant.watering_interval_days).level}
                </Badge>
              </div>
            )}

            {isCustomPlant && (
              <div>
                <h3 className="font-bold text-lg text-green-800">Custom Plant: {customName}</h3>
                <p className="text-sm text-gray-700">Default watering schedule: Every 7 days</p>
                <Badge className="bg-blue-100 text-blue-800">Custom Plant</Badge>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Give your plant a nickname..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="border-green-200 focus:border-green-400"
                />
              </div>

              <Button
                className="w-full garden-button text-lg py-6"
                onClick={addPlantToGarden}
                disabled={isLoading}
              >
                {isLoading ? 'Adding Plant...' : 
                 user ? '🌱 Add to My Garden' : '🌱 Add Plant (Saved Locally)'}
              </Button>
              
              {!user && (
                <p className="text-xs text-center text-gray-500">
                  Plant will be saved locally. Sign in to sync across devices!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
