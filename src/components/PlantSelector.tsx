
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Plus } from 'lucide-react';

interface PlantSpecies {
  id: string;
  name: string;
  scientific_name: string;
  watering_interval_days: number;
}

interface PlantSelectorProps {
  onPlantAdded: () => void;
}

export const PlantSelector = ({ onPlantAdded }: PlantSelectorProps) => {
  const [plantSpecies, setPlantSpecies] = useState<PlantSpecies[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [customScientificName, setCustomScientificName] = useState('');
  const [customInterval, setCustomInterval] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
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
    // Enhanced file validation
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
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

    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid File Extension",
        description: "Please select a valid image file.",
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

  const uploadPhoto = async (file: File): Promise<string | null> => {
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

  const addPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        
        plantData = {
          plant_name: species.name,
          scientific_name: species.scientific_name,
          watering_interval_days: species.watering_interval_days,
        };
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

      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('user_plants')
        .insert({
          ...plantData,
          user_id: userData.user?.id || null,
          photo_url: photoUrl,
          last_watered: new Date().toISOString().split('T')[0],
        });

      if (error) {
        console.error('Error adding plant:', error);
        toast({
          title: "Error Adding Plant",
          description: error.message || "Failed to add plant. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Plant Added!",
          description: "Your plant has been added successfully.",
        });
        
        // Reset form
        setSelectedSpecies('');
        setCustomName('');
        setCustomScientificName('');
        setCustomInterval('');
        setPhoto(null);
        setShowCustomForm(false);
        
        // Reset file input
        const fileInput = document.getElementById('photo') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        onPlantAdded();
      }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Plant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addPlant} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={!showCustomForm ? "default" : "outline"}
              onClick={() => setShowCustomForm(false)}
              className="flex-1"
            >
              Select from Database
            </Button>
            <Button
              type="button"
              variant={showCustomForm ? "default" : "outline"}
              onClick={() => setShowCustomForm(true)}
              className="flex-1"
            >
              Add Custom Plant
            </Button>
          </div>

          {!showCustomForm ? (
            <div className="space-y-2">
              <Label htmlFor="plant-select">Select Plant</Label>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a plant..." />
                </SelectTrigger>
                <SelectContent>
                  {plantSpecies.map((plant) => (
                    <SelectItem key={plant.id} value={plant.id}>
                      {plant.name} ({plant.scientific_name}) - Water every {plant.watering_interval_days} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-name">Plant Name *</Label>
                <Input
                  id="custom-name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., My Snake Plant"
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-scientific">Scientific Name (Optional)</Label>
                <Input
                  id="custom-scientific"
                  value={customScientificName}
                  onChange={(e) => setCustomScientificName(e.target.value)}
                  placeholder="e.g., Sansevieria trifasciata"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-interval">Watering Interval (Days) *</Label>
                <Input
                  id="custom-interval"
                  type="number"
                  min="1"
                  max="365"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(e.target.value)}
                  placeholder="e.g., 7"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="photo">Plant Photo (Optional - Max 5MB)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handlePhotoChange}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-gray-500" />
            </div>
            {photo && (
              <p className="text-sm text-gray-600">
                Selected: {photo.name} ({(photo.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding Plant...' : 'Add Plant'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
