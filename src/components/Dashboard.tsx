
import { useState, useEffect } from 'react';
import { PlantList } from './PlantList';
import { GardenerRank } from './GardenerRank';
import { RandomPlantTip } from './RandomPlantTip';
import { PWAInstall } from './PWAInstall';
import { PlantReminders } from './PlantReminders';
import { FloatingActionButton } from './FloatingActionButton';
import { Navigation } from './Navigation';
import { PlantSelector } from './PlantSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userPlants, setUserPlants] = useState([]);
  const { user } = useAuth();

  const handlePlantAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Load user plants for reminders
  useEffect(() => {
    const loadUserPlants = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('user_plants')
        .select('*')
        .eq('user_id', user.id);
      
      setUserPlants(data || []);
    };

    loadUserPlants();
  }, [user, refreshTrigger]);

  return (
    <div className="min-h-screen garden-background pb-20 lg:pb-0">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-30 dark:bg-gray-900/90">
        <Navigation />
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🌱 Plant Water Reminder
          </h1>
          <p className="text-lg text-green-700 max-w-2xl mx-auto dark:text-green-300">
            Never forget to water your plants again! Track your plant care schedule with our smart reminder system.
          </p>
        </div>

        {/* User Welcome Section */}
        {user && (
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg border border-green-200 dark:bg-gray-800/80 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-800">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
                  Welcome back, {user.email?.split('@')[0]}!
                </h2>
                <p className="text-green-600 dark:text-green-400">
                  You have {userPlants.length} plant{userPlants.length === 1 ? '' : 's'} in your garden
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Plant Section - Main Interface */}
        {user && (
          <Card className="plant-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-3 dark:text-green-200">
                🌱 Add New Plant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PlantSelector onPlantAdded={handlePlantAdded} />
            </CardContent>
          </Card>
        )}

        {/* Gardener Rank */}
        <GardenerRank refreshTrigger={refreshTrigger} />

        {/* Random Plant Tip */}
        <RandomPlantTip />

        {/* Plant Care Reminders */}
        {user && userPlants.length > 0 && (
          <PlantReminders userPlants={userPlants} />
        )}

        {/* Plant List */}
        <PlantList refreshTrigger={refreshTrigger} />

        {/* PWA Install Prompt */}
        <PWAInstall />

        {/* SEO Content */}
        <div className="mt-16 bg-white/80 backdrop-blur rounded-xl p-8 shadow-lg border border-green-200 dark:bg-gray-800/80 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center dark:text-green-200">
            The Complete Plant Care Solution
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3 dark:text-green-300">🌿 Smart Plant Database</h3>
              <p className="text-green-600 leading-relaxed dark:text-green-400">
                Access our comprehensive database of 100+ common houseplants, each with scientifically-backed watering schedules. 
                From drought-resistant succulents to moisture-loving ferns, we have the perfect care schedule for every plant type.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3 dark:text-green-300">📅 Intelligent Scheduling</h3>
              <p className="text-green-600 leading-relaxed dark:text-green-400">
                Our smart watering calculator considers plant type, pot size, season, and lighting conditions to suggest the optimal 
                watering frequency. Never worry about overwatering or underwatering your precious plants again.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3 dark:text-green-300">🔔 Advanced Reminders</h3>
              <p className="text-green-600 leading-relaxed dark:text-green-400">
                Beyond watering, set up reminders for fertilizing, pruning, misting, rotating, and repotting. 
                Create a complete care routine that keeps your plants thriving year-round with personalized schedules.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3 dark:text-green-300">📱 Works Everywhere</h3>
              <p className="text-green-600 leading-relaxed dark:text-green-400">
                Install as a Progressive Web App (PWA) for offline access and native notifications. 
                Your plant care data syncs across all devices, so you never miss a watering whether you're at home or away.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-green-700 mb-4 dark:text-green-300">Perfect for Every Plant Parent</h3>
            <p className="text-green-600 leading-relaxed max-w-3xl mx-auto dark:text-green-400">
              Whether you're a beginner starting with your first snake plant or an experienced gardener managing dozens of species, 
              our plant watering reminder tool adapts to your needs. Track growth with photos, maintain detailed care logs, 
              and build healthy habits that keep your indoor garden flourishing. Join thousands of plant parents who trust 
              us to help them create thriving, beautiful indoor spaces filled with healthy, happy plants.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onPlantAdded={handlePlantAdded} />
    </div>
  );
};
