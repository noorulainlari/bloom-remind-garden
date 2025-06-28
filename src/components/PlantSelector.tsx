
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Droplets, Leaf, Plus, Search, Filter, Calculator, Copy, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { addDays } from 'date-fns';
import { PlantTooltips } from './PlantTooltips';

interface Plant {
  id: string;
  name: string;
  scientific_name: string;
  watering_interval_days: number;
}

interface PlantSelectorProps {
  onPlantAdded: () => void;
}

const PLANT_CATEGORIES = [
  { value: 'all', label: '🌿 All Plants', emoji: '🌿' },
  { value: 'succulent', label: '🌵 Succulents', emoji: '🌵' },
  { value: 'herb', label: '🌿 Herbs', emoji: '🌿' },
  { value: 'flower', label: '🌸 Flowers', emoji: '🌸' },
  { value: 'tree', label: '🌲 Trees', emoji: '🌲' },
  { value: 'palm', label: '🌴 Palms', emoji: '🌴' },
  { value: 'fern', label: '🌿 Ferns', emoji: '🌿' }
];

// Plant watering frequency calculator
const calculateWateringFrequency = (plantType: string, potSize: string, season: string, sunlight: string): number => {
  let baseFrequency = 7; // Default 7 days
  
  // Adjust based on plant type
  if (plantType.includes('Cactus') || plantType.includes('Succulent')) baseFrequency = 14;
  if (plantType.includes('Fern') || plantType.includes('Tropical')) baseFrequency = 3;
  if (plantType.includes('Herb')) baseFrequency = 2;
  
  // Adjust for pot size
  if (potSize === 'small') baseFrequency -= 1;
  if (potSize === 'large') baseFrequency += 2;
  
  // Adjust for season
  if (season === 'summer') baseFrequency -= 1;
  if (season === 'winter') baseFrequency += 2;
  
  // Adjust for sunlight
  if (sunlight === 'direct') baseFrequency -= 1;
  if (sunlight === 'low') baseFrequency += 1;
  
  return Math.max(1, Math.min(21, baseFrequency));
};

export const PlantSelector = ({ onPlantAdded }: PlantSelectorProps) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [customPlantName, setCustomPlantName] = useState('');
  const [customScientificName, setCustomScientificName] = useState('');
  const [wateringInterval, setWateringInterval] = useState(7);
  const [lastWatered, setLastWatered] = useState(new Date().toISOString().split('T')[0]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [plantTip, setPlantTip] = useState('');
  
  // Calculator fields
  const [showCalculator, setShowCalculator] = useState(false);
  const [potSize, setPotSize] = useState('medium');
  const [season, setSeason] = useState('spring');
  const [sunlight, setSunlight] = useState('medium');
  
  // Duplicate plant feature
  const [plantToDuplicate, setPlantToDuplicate] = useState<any>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load plants from database
  useEffect(() => {
    loadPlantsFromDatabase();
  }, []);

  // Filter plants based on category and search
  useEffect(() => {
    let filtered = plants;
    
    if (selectedCategory !== 'all') {
      filtered = plants.filter(plant => {
        const name = plant.name.toLowerCase();
        switch (selectedCategory) {
          case 'succulent':
            return name.includes('cactus') || name.includes('succulent') || name.includes('aloe') || 
                   name.includes('jade') || name.includes('echeveria') || name.includes('haworthia');
          case 'herb':
            return name.includes('basil') || name.includes('mint') || name.includes('lavender');
          case 'flower':
            return name.includes('rose') || name.includes('lily') || name.includes('orchid') || 
                   name.includes('begonia') || name.includes('violet') || name.includes('geranium');
          case 'tree':
            return name.includes('fig') || name.includes('tree') || name.includes('pine');
          case 'palm':
            return name.includes('palm');
          case 'fern':
            return name.includes('fern');
          default:
            return true;
        }
      });
    }
    
    if (searchTerm) {
      filtered = filtered.filter(plant => 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPlants(filtered);
  }, [plants, selectedCategory, searchTerm]);

  const loadPlantsFromDatabase = async () => {
    const { data, error } = await supabase
      .from('plant_species')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading plants:', error);
      toast({
        title: "Error",
        description: "Failed to load plant database.",
        variant: "destructive",
      });
    } else {
      setPlants(data || []);
    }
  };

  // Plant care tips rotation
  const PLANT_TIPS = [
    "💡 Tip: Most houseplants prefer bright, indirect light rather than direct sunlight.",
    "💧 Did you know? Overwatering kills more plants than underwatering!",
    "🌱 Fun fact: Plants can improve air quality by removing toxins from your home.",
    "🌿 Tip: Yellow leaves often indicate overwatering, while brown tips suggest underwatering.",
    "🌸 Did you know? Talking to your plants can actually help them grow better!",
    "🍃 Tip: Rotate your plants weekly so all sides get equal sunlight exposure.",
    "🌵 Fun fact: Succulents store water in their leaves, making them drought-tolerant.",
    "🌺 Tip: Group plants together to create a humid microclimate they'll love."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlantTip(PLANT_TIPS[Math.floor(Math.random() * PLANT_TIPS.length)]);
    }, 10000);

    setPlantTip(PLANT_TIPS[Math.floor(Math.random() * PLANT_TIPS.length)]);
    return () => clearInterval(interval);
  }, []);

  const handlePlantSelect = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      setSelectedPlant(plant);
      setWateringInterval(plant.watering_interval_days);
      setShowSchedule(true);
    }
  };

  const handleCalculateFrequency = () => {
    if (selectedPlant) {
      const calculatedInterval = calculateWateringFrequency(
        selectedPlant.name, 
        potSize, 
        season, 
        sunlight
      );
      setWateringInterval(calculatedInterval);
      toast({
        title: "🧮 Frequency Calculated!",
        description: `Suggested watering every ${calculatedInterval} days based on your conditions.`,
      });
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkForDuplicates = async (plantName: string): Promise<boolean> => {
    if (user) {
      const { data } = await supabase
        .from('user_plants')
        .select('plant_name, custom_name')
        .eq('user_id', user.id);
      
      return data?.some(plant => 
        plant.plant_name.toLowerCase() === plantName.toLowerCase() ||
        (plant.custom_name && plant.custom_name.toLowerCase() === customName.toLowerCase())
      ) || false;
    } else {
      const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
      return localPlants.some((plant: any) => 
        plant.plant_name.toLowerCase() === plantName.toLowerCase() ||
        (plant.custom_name && plant.custom_name.toLowerCase() === customName.toLowerCase())
      );
    }
  };

  const duplicatePlant = (plantData: any) => {
    setSelectedPlant(plantData);
    setWateringInterval(plantData.watering_interval_days);
    setCustomName(plantData.custom_name || '');
    setLastWatered(new Date().toISOString().split('T')[0]);
    setShowSchedule(true);
    toast({
      title: "🔄 Plant Settings Copied!",
      description: "You can now modify and add this plant copy.",
    });
  };

  const addPlant = async () => {
    const plantName = selectedPlant ? selectedPlant.name : customPlantName;
    const scientificName = selectedPlant ? selectedPlant.scientific_name : customScientificName;
    
    if (!plantName) {
      toast({
        title: "Missing Information",
        description: "Please enter a plant name.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    if (await checkForDuplicates(plantName)) {
      toast({
        title: "Duplicate Plant",
        description: "You already have this plant in your collection.",
        variant: "destructive",
      });
      return;
    }

    const nextWaterDate = addDays(new Date(lastWatered), wateringInterval);
    
    if (user) {
      const { error } = await supabase.from('user_plants').insert({
        plant_name: plantName,
        scientific_name: scientificName,
        watering_interval_days: wateringInterval,
        last_watered: lastWatered,
        next_water_date: nextWaterDate.toISOString().split('T')[0],
        user_id: user.id,
        photo_url: photo,
        custom_name: customName || null
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add plant. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const newPlant = {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        plant_name: plantName,
        scientific_name: scientificName,
        watering_interval_days: wateringInterval,
        last_watered: lastWatered,
        next_water_date: nextWaterDate.toISOString().split('T')[0],
        photo_url: photo,
        custom_name: customName || null,
        email: email || null
      };

      const existingPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
      existingPlants.push(newPlant);
      localStorage.setItem('localPlants', JSON.stringify(existingPlants));
    }

    // Reset form
    setSelectedPlant(null);
    setCustomName('');
    setCustomPlantName('');
    setCustomScientificName('');
    setWateringInterval(7);
    setLastWatered(new Date().toISOString().split('T')[0]);
    setPhoto(null);
    setEmail('');
    setShowSchedule(false);
    setShowCalculator(false);

    toast({
      title: "🌱 Plant Added!",
      description: `${plantName} has been added to your garden.`,
    });

    onPlantAdded();
  };

  return (
    <div className="space-y-6">
      {/* Plant Tip Display */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 animate-fade-in">
        <CardContent className="p-4 text-center">
          <p className="text-green-700 text-sm font-medium">{plantTip}</p>
        </CardContent>
      </Card>

      <Card className="plant-card shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
            <Leaf className="h-6 w-6 animate-leaf-sway" />
            Add Your Plant
          </CardTitle>
          <p className="text-green-600">Choose from our database of {plants.length}+ plants or add a custom plant</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-green-600" />
              <Label className="text-green-700 font-medium">Filter by Category</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLANT_CATEGORIES.map(category => (
                <Button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  className={`${
                    selectedCategory === category.value 
                      ? 'garden-button' 
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  } transition-all duration-200`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-green-600" />
              <Label className="text-green-700 font-medium">Search Plants</Label>
            </div>
            <Input
              placeholder="Search by name or scientific name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Plant Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-green-700 font-medium">Select from Database ({filteredPlants.length} plants)</Label>
              <PlantTooltips.PlantName />
            </div>
            <Select onValueChange={handlePlantSelect}>
              <SelectTrigger className="w-full border-2 border-green-300 rounded-xl p-4 hover:border-green-400 focus:border-green-500 focus:ring-green-200 bg-white shadow-sm transition-all duration-200">
                <SelectValue placeholder="🌱 Choose a plant from our database..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-green-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredPlants.map((plant) => (
                  <SelectItem 
                    key={plant.id} 
                    value={plant.id}
                    className="p-3 hover:bg-green-50 cursor-pointer transition-colors duration-150 border-b border-green-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className="font-medium text-green-800">{plant.name}</span>
                        <span className="text-sm text-green-600 italic">{plant.scientific_name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        💧 {plant.watering_interval_days}d
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
                {filteredPlants.length === 0 && (
                  <div className="p-4 text-center text-green-600">
                    No plants found. Try adjusting your search or category filter.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* OR Divider */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex-1 border-t border-green-200"></div>
            <span className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full">OR</span>
            <div className="flex-1 border-t border-green-200"></div>
          </div>

          {/* Custom Plant Form */}
          <div className="space-y-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <h3 className="font-semibold text-green-800 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Custom Plant
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-green-700">Plant Name *</Label>
                <Input
                  placeholder="e.g., My Beautiful Rose"
                  value={customPlantName}
                  onChange={(e) => setCustomPlantName(e.target.value)}
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-700">Scientific Name (Optional)</Label>
                <Input
                  placeholder="e.g., Rosa rubiginosa"
                  value={customScientificName}
                  onChange={(e) => setCustomScientificName(e.target.value)}
                  className="border-green-300 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Custom Name for Selected Plant */}
          <div className="space-y-2">
            <Label className="text-green-700">Custom Nickname (Optional)</Label>
            <Input
              placeholder="Give your plant a special name..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="border-green-300 focus:border-green-500"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-green-700 font-medium">Plant Photo</Label>
              <PlantTooltips.PhotoUpload />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 px-4 py-2 border-2 border-green-300 rounded-lg hover:bg-green-50 cursor-pointer transition-colors duration-200"
              >
                <Camera className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Upload Photo</span>
              </label>
              {photo && (
                <div className="relative">
                  <img src={photo} alt="Plant preview" className="w-16 h-16 object-cover rounded-lg shadow-md" />
                </div>
              )}
            </div>
          </div>

          {/* Email for Reminders (Guests) */}
          {!user && (
            <div className="space-y-2">
              <Label className="text-green-700">Email for Reminders (Optional)</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
              <p className="text-sm text-green-600">
                Get watering reminders without signing up! Sign up later to save your plants.
              </p>
            </div>
          )}

          {/* Watering Frequency Calculator */}
          {selectedPlant && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Smart Watering Calculator
                </h3>
                <Button
                  onClick={() => setShowCalculator(!showCalculator)}
                  variant="ghost"
                  size="sm"
                  className="text-blue-700"
                >
                  {showCalculator ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showCalculator && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-blue-700">Pot Size</Label>
                    <Select value={potSize} onValueChange={setPotSize}>
                      <SelectTrigger className="border-blue-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-700">Season</Label>
                    <Select value={season} onValueChange={setSeason}>
                      <SelectTrigger className="border-blue-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="autumn">Autumn</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-700">Sunlight</Label>
                    <Select value={sunlight} onValueChange={setSunlight}>
                      <SelectTrigger className="border-blue-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Light</SelectItem>
                        <SelectItem value="medium">Medium Light</SelectItem>
                        <SelectItem value="direct">Direct Sun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleCalculateFrequency}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Calculate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Watering Schedule (Only shown after plant selection) */}
          {showSchedule && (
            <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 animate-slide-up">
              <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Watering Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-blue-700">Watering Interval (Days)</Label>
                    <PlantTooltips.WateringInterval />
                  </div>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={wateringInterval}
                    onChange={(e) => setWateringInterval(parseInt(e.target.value) || 7)}
                    className="border-blue-300 focus:border-blue-500"
                  />
                  {selectedPlant && (
                    <p className="text-sm text-blue-600">
                      💡 Default: Every {selectedPlant.watering_interval_days} days
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-blue-700">Last Watered</Label>
                    <PlantTooltips.LastWatered />
                  </div>
                  <Input
                    type="date"
                    value={lastWatered}
                    onChange={(e) => setLastWatered(e.target.value)}
                    className="border-blue-300 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Add Plant Button */}
          <Button
            onClick={addPlant}
            className="w-full garden-button text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={!selectedPlant && !customPlantName}
          >
            <Plus className="h-5 w-5 mr-2" />
            🌱 Add Plant to My Garden
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
