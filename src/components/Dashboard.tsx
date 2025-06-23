
import { useState, useEffect } from 'react';
import { PlantSelector } from './PlantSelector';
import { PlantList } from './PlantList';
import { AdminPanel } from './AdminPanel';
import { Header } from './Header';
import { AuthForm } from './AuthForm';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePlantAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const exportPlantSchedule = async () => {
    try {
      const { data: plants, error } = await supabase
        .from('user_plants')
        .select('plant_name, scientific_name, watering_interval_days, last_watered, next_water_date')
        .order('next_water_date');

      if (error) throw error;

      if (!plants || plants.length === 0) {
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
          `"${plant.plant_name}"`,
          `"${plant.scientific_name || ''}"`,
          plant.watering_interval_days,
          plant.last_watered,
          plant.next_water_date
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

      toast({
        title: "Export Successful",
        description: "Your plant schedule has been downloaded as CSV.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export plant schedule.",
        variant: "destructive",
      });
    }
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
    <div className="min-h-screen bg-gray-50">
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
  );
};
