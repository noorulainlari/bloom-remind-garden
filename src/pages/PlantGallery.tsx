
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Leaf, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryPlant {
  id: string;
  plant_name: string;
  scientific_name: string;
  photo_url: string;
  watering_interval_days: number;
  created_at: string;
}

export const PlantGallery = () => {
  const [plants, setPlants] = useState<GalleryPlant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleryPlants();
  }, []);

  const loadGalleryPlants = async () => {
    try {
      const { data, error } = await supabase
        .from('user_plants')
        .select('id, plant_name, scientific_name, photo_url, watering_interval_days, created_at')
        .not('photo_url', 'is', null)
        .not('photo_url', 'eq', '')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading gallery plants:', error);
      } else {
        // Filter out base64 images (local storage images)
        const publicPlants = (data || []).filter(plant => 
          plant.photo_url && !plant.photo_url.startsWith('data:')
        );
        setPlants(publicPlants);
      }
    } catch (error) {
      console.error('Unexpected error loading gallery plants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🌱</div>
            <p className="text-green-600">Loading plant gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Plant Tracker
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-green-800 font-lora">🌿 Community Plant Gallery</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {plants.length} plant{plants.length === 1 ? '' : 's'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4 font-lora">
            Beautiful Plants from Our Community
          </h2>
          <p className="text-green-600 text-lg max-w-2xl mx-auto">
            Discover inspiration from fellow plant parents. See how others care for their green friends and get ideas for your own plant collection.
          </p>
        </div>

        {plants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🌱</div>
            <h3 className="text-2xl font-semibold text-green-800 mb-4">No Public Plants Yet</h3>
            <p className="text-green-600 mb-8 max-w-md mx-auto">
              Be the first to share your beautiful plants with the community! Upload photos when adding plants to your collection.
            </p>
            <Link to="/">
              <Button className="bg-green-600 hover:bg-green-700">
                <Leaf className="h-4 w-4 mr-2" />
                Add Your First Plant
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plants.map((plant) => (
              <Card key={plant.id} className="group hover:shadow-xl transition-all duration-300 border-green-200 bg-white overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={plant.photo_url}
                    alt={plant.plant_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-800 text-lg mb-1 truncate">
                    {plant.plant_name}
                  </h3>
                  {plant.scientific_name && (
                    <p className="text-sm text-green-600 italic mb-3 truncate">
                      {plant.scientific_name}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 flex items-center gap-1">
                      💧 Every {plant.watering_interval_days} day{plant.watering_interval_days === 1 ? '' : 's'}
                    </span>
                    <span className="text-gray-500">
                      {new Date(plant.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {plants.length > 0 && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-6 py-3 rounded-full border border-green-200">
              <Camera className="h-5 w-5" />
              <span className="font-medium">Share your plants by uploading photos when you add them!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantGallery;
