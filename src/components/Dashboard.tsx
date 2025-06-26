
import { useState, useEffect } from 'react';
import { PlantSelector } from './PlantSelector';
import { PlantList } from './PlantList';
import { AdminPanel } from './AdminPanel';
import { Header } from './Header';
import { AuthForm } from './AuthForm';
import { Footer } from './Footer';
import { Button } from '@/components/ui/button';
import { Download, X, Upload } from 'lucide-react';
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
      setShowSyncPrompt(true);
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
          user_id: user.id
        });
      }

      localStorage.removeItem('localPlants');
      setShowSyncPrompt(false);
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: "Sync Complete",
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
      // Security fix: Only export user's own plants or all plants if admin
      let query = supabase
        .from('user_plants')
        .select('plant_name, scientific_name, watering_interval_days, last_watered, next_water_date')
        .order('next_water_date');

      // If user is not authenticated, get plants from localStorage
      if (!user) {
        const localPlantsData = localStorage.getItem('localPlants');
        if (!localPlantsData) {
          toast({
            title: "No Data",
            description: "No plants to export.",
            variant: "destructive",
          });
          return;
        }

        const localPlants = JSON.parse(localPlantsData);
        const csvContent = [
          ['Plant Name', 'Scientific Name', 'Watering Interval (Days)', 'Last Watered', 'Next Water Date'].join(','),
          ...localPlants.map((plant: any) => [
            `"${(plant.plant_name || '').replace(/"/g, '""')}"`,
            `"${(plant.scientific_name || '').replace(/"/g, '""')}"`,
            plant.watering_interval_days || 0,
            plant.last_watered || '',
            plant.next_water_date || ''
          ].join(','))
        ].join('\n');

        downloadCSV(csvContent);
        return;
      }

      // If user is authenticated, only show user's own plants
      query = query.eq('user_id', user.id);

      const { data: plants, error } = await query;

      if (error) {
        console.error('Export error:', error);
        throw error;
      }

      if (!plants || plants.length === 0) {
        toast({
          title: "No Data",
          description: "No plants to export.",
          variant: "destructive",
        });
        return;
      }

      // Create CSV content with proper sanitization
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

      downloadCSV(csvContent);

      toast({
        title: "Export Successful",
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

  const downloadCSV = (csvContent: string) => {
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
  };

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAdminToggle={setShowAdmin} onAuthToggle={setShowAuth} />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <AdminPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAdminToggle={setShowAdmin} onAuthToggle={setShowAuth} />
      
      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
            <Button
              onClick={() => setShowAuth(false)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sync Your Plants?</h3>
              <p className="text-gray-600 mb-6">
                We found plants saved locally on this device. Would you like to sync them to your account?
              </p>
              <div className="flex gap-3">
                <Button onClick={syncLocalStorageToSupabase} className="flex-1">
                  Yes, Sync Plants
                </Button>
                <Button onClick={() => setShowSyncPrompt(false)} variant="outline" className="flex-1">
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Online Plant Watering Reminder – Never Forget to Water Again
                </h1>
                <p className="text-gray-600 mt-2">
                  Track your plants and get reminders when it's time to water them.
                  {!user && (
                    <span className="block text-green-600 font-medium mt-1">
                      No signup required! You can use all features anonymously. Sign up only if you want email reminders.
                    </span>
                  )}
                </p>
              </div>
              <Button onClick={exportPlantSchedule} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Schedule
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <PlantSelector onPlantAdded={handlePlantAdded} />
              </div>
              <div className="lg:col-span-2">
                <PlantList refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
