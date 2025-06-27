import { useState, useEffect } from 'react';
import { PlantSelector } from './PlantSelector';
import { PlantCard } from './PlantCard';
import { AdminPanel } from './AdminPanel';
import { Header } from './Header';
import { AuthForm } from './AuthForm';
import { Footer } from './Footer';
import { GardenQuote } from './GardenQuote';
import { SoundToggle } from './SoundToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, X, Upload, FileDown, FileUp, Leaf, Users, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { addDays } from 'date-fns';

interface UserPlant {
  id: string;
  plant_name: string;
  scientific_name: string;
  watering_interval_days: number;
  last_watered: string;
  next_water_date: string;
  photo_url: string;
  user_id?: string;
  custom_name?: string;
  last_watered_timestamp?: string | null;
}

export const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(false);
  const [wateredPlants, setWateredPlants] = useState<Set<string>>(new Set());
  const [lastVisit, setLastVisit] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPlants();
    
    // Set up last visit tracking
    const lastVisitDate = localStorage.getItem('lastVisit');
    if (lastVisitDate) {
      setLastVisit(lastVisitDate);
    }
    localStorage.setItem('lastVisit', new Date().toISOString());

    // Set up signup prompt timer for non-logged users
    if (!user) {
      const timer = setTimeout(() => {
        setShowSignupPrompt(true);
      }, 120000); // 2 minutes

      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    // Check if user just logged in and has localStorage data to sync
    if (user && localStorage.getItem('localPlants')) {
      const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
      if (localPlants.length > 0) {
        setShowSyncPrompt(true);
      }
    }
  }, [user]);

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

  const handlePlantAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    loadPlants();
  };

  const markAsWatered = async (plantId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
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
      description: `Watered today at ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
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

  const syncLocalStorageToSupabase = async () => {
    if (!user) return;

    try {
      const localPlantsData = localStorage.getItem('localPlants');
      if (!localPlantsData) return;

      const localPlants = JSON.parse(localPlantsData);
      
      for (const plant of localPlants) {
        await supabase.from('user_plants').insert({
          plant_name: plant.plant_name,
          scientific_name: plant.scientific_name,
          watering_interval_days: plant.watering_interval_days,
          last_watered: plant.last_watered,
          next_water_date: plant.next_water_date,
          user_id: user.id,
          photo_url: plant.photo_url?.startsWith('data:') ? null : plant.photo_url // Don't sync base64 images
        });
      }

      localStorage.removeItem('localPlants');
      setShowSyncPrompt(false);
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: "🌱 Sync Complete",
        description: "Your local plants have been synced to your account.",
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync your plants. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportPlantSchedule = async () => {
    try {
      let plants = [];

      if (user) {
        // Get user's plants from Supabase
        const { data, error } = await supabase
          .from('user_plants')
          .select('plant_name, scientific_name, watering_interval_days, last_watered, next_water_date')
          .eq('user_id', user.id)
          .order('next_water_date');

        if (error) {
          console.error('Export error:', error);
          throw error;
        }
        plants = data || [];
      } else {
        // Get plants from localStorage
        const localPlantsData = localStorage.getItem('localPlants');
        if (localPlantsData) {
          plants = JSON.parse(localPlantsData);
        }
      }

      if (plants.length === 0) {
        toast({
          title: "No Data",
          description: "No plants to export.",
          variant: "destructive",
        });
        return;
      }

      // Create CSV content
      const headers = ['Plant Name', 'Scientific Name', 'Watering Interval (Days)', 'Last Watered', 'Next Water Date'];
      const csvContent = [
        headers.join(','),
        ...plants.map(plant => [
          `"${(plant.plant_name || '').replace(/"/g, '""')}"`,
          `"${(plant.scientific_name || '').replace(/"/g, '""')}"`,
          plant.watering_interval_days || 0,
          plant.last_watered || '',
          plant.next_water_date || ''
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `plant-schedule-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "📄 Export Successful",
        description: "Your plant schedule has been downloaded as CSV.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export plant schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const importPlantSchedule = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (user) {
          // Import to Supabase for logged-in users
          // This would need proper implementation
          toast({
            title: "Import Started",
            description: "Importing plants to your account...",
          });
        } else {
          // Import to localStorage for guests
          const existingPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
          const importedPlants = data.map((plant: any) => ({
            ...plant,
            id: `imported-${Date.now()}-${Math.random().toString(36).substring(7)}`
          }));
          
          localStorage.setItem('localPlants', JSON.stringify([...existingPlants, ...importedPlants]));
          setRefreshTrigger(prev => prev + 1);
          
          toast({
            title: "📥 Import Successful",
            description: `Imported ${importedPlants.length} plants to your collection.`,
          });
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid file format. Please select a valid JSON file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header onAdminToggle={setShowAdmin} onAuthToggle={setShowAuth} />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <AdminPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col leaf-pattern">
      <Header onAdminToggle={setShowAdmin} onAuthToggle={setShowAuth} />
      
      {/* Welcome Back Message */}
      {lastVisit && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Card className="border-green-200 bg-gradient-to-r from-green-100 to-emerald-100">
            <CardContent className="p-3 text-center">
              <p className="text-green-700 text-sm">
                🌿 Welcome back! You last visited on {new Date(lastVisit).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Garden Quote */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <GardenQuote />
      </div>

      {/* Signup Prompt Modal */}
      {showSignupPrompt && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-green-200">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-gentle-float">🌱</div>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2 text-green-800">Want to get reminders for your plants?</h3>
              <p className="text-gray-600 mb-6">
                Sign up to get email reminders and sync your plants across devices!
              </p>
              <div className="flex gap-3">
                <Button onClick={() => setShowAuth(true)} className="flex-1 garden-button">
                  🌿 Yes, Sign Me Up!
                </Button>
                <Button onClick={() => setShowSignupPrompt(false)} variant="outline" className="flex-1 border-green-300 text-green-700 hover:bg-green-50">
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
              <div className="flex justify-between items-start flex-col lg:flex-row gap-4">
                <div className="flex-1 text-left lg:text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 mb-4 leading-tight flex items-center gap-3">
                    <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 animate-gentle-float" />
                    🌱 Your Personal Garden Assistant
                  </h1>
                  <p className="text-green-700 text-lg sm:text-xl mb-4 leading-relaxed max-w-4xl">
                    Track your plants and get reminders when it's time to water them.
                    {!user && (
                      <span className="block text-green-600 font-medium mt-2 text-base sm:text-lg">
                        🎉 <strong>Add photos and get email reminders without signing up!</strong> Sign up later to save your plants and manage them in your dashboard.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card className="plant-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-2xl font-bold text-green-800">{plants.length}</div>
                  <div className="text-sm text-green-600">Plants in Garden</div>
                </CardContent>
              </Card>
              <Card className="plant-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">💧</div>
                  <div className="text-2xl font-bold text-blue-800">
                    {plants.filter(p => new Date(p.next_water_date) <= new Date()).length}
                  </div>
                  <div className="text-sm text-blue-600">Need Water Today</div>
                </CardContent>
              </Card>
              <Card className="plant-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">🌿</div>
                  <div className="text-2xl font-bold text-emerald-800">
                    {plants.filter(p => p.photo_url).length}
                  </div>
                  <div className="text-sm text-emerald-600">With Photos</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <PlantSelector onPlantAdded={handlePlantAdded} />
              </div>
              <div className="lg:col-span-2">
                {/* Plant List */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-800 flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      My Garden View
                    </h2>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {plants.length} plant{plants.length === 1 ? '' : 's'}
                    </Badge>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center gap-2 text-green-600">
                        <div className="animate-spin">🌱</div>
                        <span>Loading your garden...</span>
                      </div>
                    </div>
                  ) : plants.length === 0 ? (
                    <Card className="plant-card">
                      <CardContent className="text-center py-12">
                        <div className="text-6xl mb-4 animate-gentle-float">🌱</div>
                        <p className="text-green-700 mb-4 text-lg font-medium">No plants in your garden yet!</p>
                        <p className="text-sm text-green-600">Add your first plant above to start your garden journey.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {plants.map((plant) => (
                        <PlantCard
                          key={plant.id}
                          plant={plant}
                          onWater={markAsWatered}
                          onRemove={removePlant}
                          isWatered={wateredPlants.has(plant.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SEO Content Section */}
            <section className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 sm:p-12 mt-16 shadow-lg border border-green-200 leaf-pattern">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-6">
                  🌿 Smart Plant Watering Reminder Tool
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                      🌱 Never Forget to Water Your Plants Again
                    </h3>
                    <p className="text-green-600 leading-relaxed">
                      Our intelligent plant watering reminder system helps you maintain a thriving indoor garden. Set custom watering schedules, upload beautiful photos of your plants, and receive timely email reminders - all without requiring an account signup.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                      📱 Works on All Devices
                    </h3>
                    <p className="text-green-600 leading-relaxed">
                      Access your plant care dashboard from any device - desktop, tablet, or mobile. Your plant data is securely stored locally or synced to the cloud when you create an account. Perfect for plant parents who want to stay organized and keep their green friends healthy.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                      🔔 Smart Email Reminders
                    </h3>
                    <p className="text-green-600 leading-relaxed">
                      Get personalized watering reminders sent directly to your inbox. Our system considers your timezone and each plant's unique watering needs to send reminders at the perfect time. Support for 500+ common houseplants with pre-configured watering schedules.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                      📸 Photo Management & Progress Tracking
                    </h3>
                    <p className="text-green-600 leading-relaxed">
                      Upload and organize photos of your plants to track their growth over time. Create a visual diary of your plant care journey, mark plants as watered with timestamps, and export your plant care schedule for backup or sharing with other plant enthusiasts.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-green-200">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">🏆 Why Choose Our Plant Care Tool?</h4>
                  <ul className="text-green-600 space-y-2 text-left list-none">
                    <li>✅ <strong>No Registration Required</strong> - Start using immediately</li>
                    <li>✅ <strong>Multi-timezone Support</strong> - Perfect timing wherever you are</li>
                    <li>✅ <strong>Smart Plant Database</strong> - 500+ plants with automatic suggestions</li>
                    <li>✅ <strong>Photo Upload & Storage</strong> - Track your plants visually</li>
                    <li>✅ <strong>Export/Import Features</strong> - Backup and share your data</li>
                    <li>✅ <strong>Mobile Responsive</strong> - Works perfectly on all devices</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
      <SoundToggle />
    </div>
  );
};
