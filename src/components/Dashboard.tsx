
import { useState, useEffect } from "react";
import { PlantSelector } from "./PlantSelector";
import { PlantList } from "./PlantList";
import { PlantCareDashboard } from "./PlantCareDashboard";
import { PlantInventory } from "./PlantInventory";
import { WateringCalendar } from "./WateringCalendar";
import { RandomPlantTip } from "./RandomPlantTip";
import { GardenQuote } from "./GardenQuote";
import { FloatingActionButton } from "./FloatingActionButton";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ImprovedSoundSettings } from "./ImprovedSoundSettings";
import { PlantQuiz } from "./PlantQuiz";
import { FeatureHub } from "./features/FeatureHub";
import { Button } from "./ui/button";
import { Brain, Sparkles, Volume2, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [plants, setPlants] = useState<any[]>([]);
  const [showSounds, setShowSounds] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFeatureHub, setShowFeatureHub] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPlants();
  }, [user, refreshTrigger]);

  const loadPlants = async () => {
    try {
      let allPlants: any[] = [];

      if (user) {
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
        const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
        allPlants = localPlants;
      }

      setPlants(allPlants);
    } catch (error) {
      console.error('Error loading plants:', error);
    }
  };

  const handlePlantAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAdminToggle = (isAdmin: boolean) => {
    setShowAdmin(isAdmin);
  };

  const handleAuthToggle = (showAuth: boolean) => {
    setShowAuth(showAuth);
  };

  const handleWaterPlant = async (plantId: string) => {
    console.log('handleWaterPlant called with plantId:', plantId);
    console.log('Current plants:', plants);
    
    try {
      // Safe date formatting with error handling
      const getCurrentDate = () => {
        try {
          const dateStr = new Date().toISOString();
          console.log('Generated ISO string:', dateStr);
          if (!dateStr || typeof dateStr !== 'string') {
            throw new Error('Invalid date string generated');
          }
          return dateStr.split('T')[0];
        } catch (error) {
          console.error('Error generating current date:', error);
          // Fallback to manual date formatting
          const now = new Date();
          return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }
      };

      const today = getCurrentDate();
      console.log('Today date:', today);
      
      const plant = plants.find(p => p.id === plantId);
      console.log('Found plant:', plant);
      
      if (!plant) {
        console.warn('Plant not found for ID:', plantId);
        return;
      }

      if (!plant.watering_interval_days || typeof plant.watering_interval_days !== 'number') {
        console.warn('Invalid watering interval for plant:', plant);
        return;
      }

      const nextWaterDate = addDays(new Date(today), plant.watering_interval_days);
      console.log('Next water date calculated:', nextWaterDate);
      
      // Safe ISO string conversion
      const getNextWaterDateString = () => {
        try {
          const isoString = nextWaterDate.toISOString();
          if (!isoString || typeof isoString !== 'string') {
            throw new Error('Invalid next water date ISO string');
          }
          return isoString.split('T')[0];
        } catch (error) {
          console.error('Error formatting next water date:', error);
          return today; // Fallback to today's date
        }
      };

      const nextWaterDateString = getNextWaterDateString();
      console.log('Next water date string:', nextWaterDateString);
      
      const timestamp = new Date().toISOString();

      if (user) {
        console.log('Updating database for user:', user.id);
        const { error } = await supabase
          .from('user_plants')
          .update({
            last_watered: today,
            next_water_date: nextWaterDateString,
            last_watered_timestamp: timestamp
          })
          .eq('id', plantId);

        if (error) {
          console.error('Database update error:', error);
          return;
        }
        console.log('Database updated successfully');
      } else {
        console.log('Updating localStorage');
        const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
        const updatedPlants = localPlants.map((p: any) => 
          p.id === plantId ? {
            ...p,
            last_watered: today,
            next_water_date: nextWaterDateString,
            last_watered_timestamp: timestamp
          } : p
        );
        localStorage.setItem('localPlants', JSON.stringify(updatedPlants));
        console.log('localStorage updated successfully');
      }

      toast({
        title: "🌱 Plant Watered!",
        description: `${plant.plant_name || 'Your plant'} has been watered successfully.`,
      });

      loadPlants(); // Refresh plants data
    } catch (error) {
      console.error('Error updating plant:', error);
      toast({
        title: "Error",
        description: "Failed to update plant watering status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header onAdminToggle={handleAdminToggle} onAuthToggle={handleAuthToggle} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              Plant Care Tracker
            </h1>
            <p className="text-lg text-green-600">
              Nurture your plants with love and technology
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/features">
              <Button className="w-full h-16 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Sparkles className="h-5 w-5 mr-2" />
                Explore 100+ Features
              </Button>
            </Link>
            
            <Button 
              className="w-full h-16 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => setShowQuiz(!showQuiz)}
            >
              <Brain className="h-5 w-5 mr-2" />
              Plant Care Quiz
            </Button>
            
            <Button 
              className="w-full h-16 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              onClick={() => setShowSounds(!showSounds)}
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Nature Sounds
            </Button>

            <Button 
              className="w-full h-16 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => setShowFeatureHub(!showFeatureHub)}
            >
              <Settings className="h-5 w-5 mr-2" />
              Feature Hub
            </Button>
          </div>

          {showQuiz && <PlantQuiz />}
          {showSounds && <ImprovedSoundSettings />}
          {showFeatureHub && (
            <FeatureHub 
              plants={plants} 
              onWaterPlant={handleWaterPlant}
              onClose={() => setShowFeatureHub(false)}
            />
          )}

          <PlantSelector onPlantAdded={handlePlantAdded} />
          <PlantList refreshTrigger={refreshTrigger} />

          {plants.length > 0 && (
            <PlantCareDashboard plants={plants} />
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <PlantInventory plants={plants} />
            <WateringCalendar plants={plants} />
          </div>

          <RandomPlantTip />
          <GardenQuote />
        </div>
      </div>

      <Footer />
      <FloatingActionButton />
    </div>
  );
};
