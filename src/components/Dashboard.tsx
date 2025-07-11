
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
import { Button } from "./ui/button";
import { Brain, Sparkles, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [plants, setPlants] = useState<any[]>([]);
  const [showSounds, setShowSounds] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();

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
          <div className="grid md:grid-cols-3 gap-4">
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
          </div>

          {showQuiz && <PlantQuiz />}
          {showSounds && <ImprovedSoundSettings />}

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
