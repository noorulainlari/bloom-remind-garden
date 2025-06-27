
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Upload, Plus, Leaf } from 'lucide-react';
import { addDays } from 'date-fns';

interface PlantSpecies {
  id: string;
  name: string;
  scientific_name: string;
  watering_interval_days: number;
}

interface PlantSelectorProps {
  onPlantAdded: () => void;
}

const SMART_SUGGESTIONS = {
  "Snake Plant": 14,
  "Pothos": 7,
  "Spider Plant": 5,
  "Peace Lily": 7,
  "Rubber Plant": 10,
  "Fiddle Leaf Fig": 7,
  "Monstera": 7,
  "ZZ Plant": 14,
  "Aloe Vera": 10,
  "Succulent": 14,
  "Cactus": 21,
  "Basil": 3,
  "Mint": 3,
  "Rosemary": 5
};

export const PlantSelector = ({ onPlantAdded }: PlantSelectorProps) => {
  const [plantSpecies, setPlantSpecies] = useState<PlantSpecies[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [customScientificName, setCustomScientificName] = useState('');
  const [customInterval, setCustomInterval] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [emailReminder, setEmailReminder] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPlantSpecies();
  }, []);

  const loadPlantSpecies = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_species')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading plant species:', error);
      } else {
        setPlantSpecies(data || []);
      }
    } catch (error) {
      console.error('Unexpected error loading plant species:', error);
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setPhoto(file);
    } else {
      e.target.value = '';
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!user) {
      // For non-logged users, convert to base64 and store locally
      try {
        const base64 = await convertFileToBase64(file);
        return base64;
      } catch (error) {
        console.error('Error converting file to base64:', error);
        return null;
      }
    }
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `plant-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('plant-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('plant-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Unexpected error uploading photo:', error);
      return null;
    }
  };

  const checkForDuplicates = (plantName: string): boolean => {
    const existingPlants = user ? 
      [] : // Will be checked in Supabase for logged users
      JSON.parse(localStorage.getItem('localPlants') || '[]');
    
    if (!user) {
      return existingPlants.some((plant: any) => 
        plant.plant_name.toLowerCase() === plantName.toLowerCase()
      );
    }
    return false; // For logged users, we'll check in the database
  };

  const handleCustomNameChange = (value: string) => {
    setCustomName(value);
    setDuplicateError('');
    
    // Check for smart suggestions
    const suggestion = SMART_SUGGESTIONS[value as keyof typeof SMART_SUGGESTIONS];
    if (suggestion) {
      setCustomInterval(suggestion.toString());
    }
  };

  const addPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDuplicateError('');

    try {
      let plantData;
      
      if (showCustomForm) {
        if (!customName || !customInterval) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Check for duplicates
        if (checkForDuplicates(customName)) {
          setDuplicateError("You've already added this plant.");
          setLoading(false);
          return;
        }

        const intervalNum = parseInt(customInterval);
        if (isNaN(intervalNum) || intervalNum < 1 || intervalNum > 365) {
          toast({
            title: "Invalid Watering Interval",
            description: "Watering interval must be between 1 and 365 days.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        plantData = {
          plant_name: customName.trim(),
          scientific_name: customScientificName.trim() || null,
          watering_interval_days: intervalNum,
        };
      } else {
        if (!selectedSpecies) {
          toast({
            title: "No Plant Selected",
            description: "Please select a plant from the dropdown.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        const species = plantSpecies.find(p => p.id === selectedSpecies);
        if (!species) {
          setLoading(false);
          return;
        }

        // Check for duplicates
        if (checkForDuplicates(species.name)) {
          setDuplicateError("You've already added this plant.");
          setLoading(false);
          return;
        }
        
        plantData = {
          plant_name: species.name,
          scientific_name: species.scientific_name,
          watering_interval_days: species.watering_interval_days,
        };
      }

      const today = new Date().toISOString().split('T')[0];
      const nextWaterDate = addDays(new Date(today), plantData.watering_interval_days);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (user) {
        // Check for duplicates in Supabase
        const { data: existingPlant } = await supabase
          .from('user_plants')
          .select('id')
          .eq('user_id', user.id)
          .ilike('plant_name', plantData.plant_name)
          .limit(1);

        if (existingPlant && existingPlant.length > 0) {
          setDuplicateError("You've already added this plant.");
          setLoading(false);
          return;
        }

        let photoUrl = null;
        if (photo) {
          photoUrl = await uploadPhoto(photo);
          if (!photoUrl) {
            toast({
              title: "Upload Failed",
              description: "Failed to upload photo. Plant will be added without image.",
            });
          }
        }

        const { error } = await supabase
          .from('user_plants')
          .insert({
            ...plantData,
            user_id: user.id,
            photo_url: photoUrl,
            last_watered: today,
            next_water_date: nextWaterDate.toISOString().split('T')[0],
          });

        if (error) {
          console.error('Error adding plant:', error);
          toast({
            title: "Error Adding Plant",
            description: error.message || "Failed to add plant. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } else {
        // Save to localStorage for guests with full functionality
        let photoUrl = '';
        if (photo) {
          photoUrl = await uploadPhoto(photo) || '';
        }

        const newPlant = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          ...plantData,
          last_watered: today,
          next_water_date: nextWaterDate.toISOString().split('T')[0],
          photo_url: photoUrl,
          created_at: new Date().toISOString(),
          email_reminder: emailReminder,
          timezone: timezone,
          last_watered_timestamp: null
        };

        const existingPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
        existingPlants.push(newPlant);
        localStorage.setItem('localPlants', JSON.stringify(existingPlants));

        // Store email reminder info
        if (emailReminder) {
          const reminders = JSON.parse(localStorage.getItem('plantReminders') || '[]');
          reminders.push({
            plantId: newPlant.id,
            email: emailReminder,
            nextReminder: nextWaterDate.toISOString(),
            timezone: timezone
          });
          localStorage.setItem('plantReminders', JSON.stringify(reminders));
        }
      }

      toast({
        title: "🌱 Plant Added!",
        description: "Your plant has been added successfully.",
      });
      
      // Reset form
      setSelectedSpecies('');
      setCustomName('');
      setCustomScientificName('');
      setCustomInterval('');
      setPhoto(null);
      setEmailReminder('');
      setShowCustomForm(false);
      setDuplicateError('');
      
      // Reset file input
      const fileInput = document.getElementById('photo') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      onPlantAdded();
    } catch (error) {
      console.error('Error adding plant:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Card className="border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-white">
      <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Leaf className="h-5 w-5 text-green-600" />
          Add New Plant 🌱
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={addPlant} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Button
              type="button"
              variant={!showCustomForm ? "default" : "outline"}
              onClick={() => setShowCustomForm(false)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              🍀 Select from Database
            </Button>
            <Button
              type="button"
              variant={showCustomForm ? "default" : "outline"}
              onClick={() => setShowCustomForm(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              🌿 Add Custom Plant
            </Button>
          </div>

          {duplicateError && (
            <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg">
              <p className="text-orange-700 text-sm font-medium">{duplicateError}</p>
            </div>
          )}

          {!showCustomForm ? (
            <div className="space-y-2">
              <Label htmlFor="plant-select" className="text-green-800 font-medium">Select Plant</Label>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger className="border-green-300 focus:border-green-500 bg-white">
                  <SelectValue placeholder="🔍 Choose a plant..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-green-200 max-h-60 overflow-y-auto">
                  {plantSpecies.map((plant) => (
                    <SelectItem key={plant.id} value={plant.id} className="hover:bg-green-50">
                      <div className="flex flex-col">
                        <span className="font-medium">{plant.name}</span>
                        <span className="text-sm text-gray-500 italic">{plant.scientific_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSpecies && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    💧 <strong>Watering Schedule:</strong> Every {plantSpecies.find(p => p.id === selectedSpecies)?.watering_interval_days} days
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-name" className="text-green-800 font-medium">Plant Name *</Label>
                <Input
                  id="custom-name"
                  value={customName}
                  onChange={(e) => handleCustomNameChange(e.target.value)}
                  placeholder="e.g., My Snake Plant"
                  maxLength={100}
                  required
                  className="border-green-300 focus:border-green-500"
                />
                {SMART_SUGGESTIONS[customName as keyof typeof SMART_SUGGESTIONS] && (
                  <p className="text-sm text-green-600">
                    💡 Smart suggestion: Water every {SMART_SUGGESTIONS[customName as keyof typeof SMART_SUGGESTIONS]} days
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-scientific" className="text-green-800 font-medium">Scientific Name (Optional)</Label>
                <Input
                  id="custom-scientific"
                  value={customScientificName}
                  onChange={(e) => setCustomScientificName(e.target.value)}
                  placeholder="e.g., Sansevieria trifasciata"
                  maxLength={100}
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-interval" className="text-green-800 font-medium">Watering Interval (Days) *</Label>
                <Input
                  id="custom-interval"
                  type="number"
                  min="1"
                  max="365"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(e.target.value)}
                  placeholder="e.g., 7"
                  required
                  className="border-green-300 focus:border-green-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-4 border-t border-green-200 pt-4">
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-green-800 font-medium">📸 Plant Photo (Optional - Max 5MB)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoChange}
                  className="flex-1 border-green-300 focus:border-green-500"
                />
                <Upload className="h-4 w-4 text-green-500" />
              </div>
              {photo && (
                <p className="text-sm text-green-600">
                  ✅ Selected: {photo.name} ({(photo.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {!user && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-800 font-medium">📧 Email for Reminders (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailReminder}
                  onChange={(e) => setEmailReminder(e.target.value)}
                  placeholder="your@email.com"
                  className="border-green-300 focus:border-green-500"
                />
              </div>
            )}
          </div>

          <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              🌟 <strong>Tip:</strong> Add photos and get email reminders without signing up. Sign up later to save your plants and manage them in your dashboard.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 text-base sm:text-lg rounded-lg shadow-md transition-all duration-200">
            {loading ? '🌱 Adding Plant...' : '🌿 Add Plant'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
