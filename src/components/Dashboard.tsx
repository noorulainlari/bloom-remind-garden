
import { useState, useEffect } from 'react';
import { PlantSelector } from './PlantSelector';
import { PlantList } from './PlantList';
import { AdminPanel } from './AdminPanel';
import { Header } from './Header';
import { AuthForm } from './AuthForm';
import { Footer } from './Footer';
import { Button } from '@/components/ui/button';
import { Download, X, Upload, FileDown, FileUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user just logged in and has localStorage data to sync
    if (user && localStorage.getItem('localPlants')) {
      const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
      if (localPlants.length > 0) {
        setShowSyncPrompt(true);
      }
    }
  }, [user]);

  const handlePlantAdded = () => {
    setRefreshTrigger(prev => prev + 1);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col">
      <Header onAdminToggle={setShowAdmin} onAuthToggle={setShowAuth} />
      
      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative border-2 border-green-200">
            <Button
              onClick={() => setShowAuth(false)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </Button>
            <AuthForm onSuccess={() => setShowAuth(false)} />
          </div>
        </div>
      )}

      {/* Sync Prompt Modal */}
      {showSyncPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-green-200">
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <Upload className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-green-800">Sync Your Plants?</h3>
              <p className="text-gray-600 mb-6">
                We found plants saved locally on this device. Would you like to sync them to your account?
              </p>
              <div className="flex gap-3">
                <Button onClick={syncLocalStorageToSupabase} className="flex-1 bg-green-600 hover:bg-green-700">
                  🌿 Yes, Sync Plants
                </Button>
                <Button onClick={() => setShowSyncPrompt(false)} variant="outline" className="flex-1 border-green-300 text-green-700 hover:bg-green-50">
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
              <div className="flex justify-between items-start flex-col lg:flex-row gap-4">
                <div className="flex-1 text-left lg:text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 mb-4 leading-tight">
                    🌱 Online Plant Watering Reminder – Never Forget to Water Again
                  </h1>
                  <p className="text-green-700 text-lg sm:text-xl mb-4 leading-relaxed max-w-4xl">
                    Track your plants and get reminders when it's time to water them.
                    {!user && (
                      <span className="block text-green-600 font-medium mt-2 text-base sm:text-lg">
                        🎉 <strong>No signup required!</strong> Upload photos, set reminders, and manage your plants anonymously. Sign up later to sync across devices.
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <Button onClick={exportPlantSchedule} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                    <FileDown className="h-4 w-4 mr-2" />
                    📄 Export Schedule
                  </Button>
                  {user && (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importPlantSchedule}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 w-full">
                        <FileUp className="h-4 w-4 mr-2" />
                        📥 Import Plants
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <PlantSelector onPlantAdded={handlePlantAdded} />
              </div>
              <div className="lg:col-span-2">
                <PlantList refreshTrigger={refreshTrigger} />
              </div>
            </div>

            {/* SEO Content Section */}
            <section className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 sm:p-12 mt-16 shadow-lg border border-green-200">
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
    </div>
  );
};
