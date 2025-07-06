
import { useState, useEffect } from 'react';
import { PlantList } from './PlantList';
import { GardenerRank } from './GardenerRank';
import { RandomPlantTip } from './RandomPlantTip';
import { PWAInstall } from './PWAInstall';
import { PlantReminders } from './PlantReminders';
import { FloatingActionButton } from './FloatingActionButton';
import { Navigation } from './Navigation';
import { PlantSelector } from './PlantSelector';
import { SoundSettings } from './SoundSettings';
import { AuthForm } from './AuthForm';
import { PlantCareStats } from './PlantCareStats';
import { WeatherWidget } from './WeatherWidget';
import { PlantCareCalendar } from './PlantCareCalendar';
import { PlantCommunity } from './PlantCommunity';
import { PlantCareReminders } from './PlantCareReminders';
import { PlantDiseaseDetector } from './PlantDiseaseDetector';
import { PlantCareDashboard } from './PlantCareDashboard';
import { PlantJournal } from './PlantJournal';
import { PlantCompare } from './PlantCompare';
import { PlantAchievements } from './PlantAchievements';
import { PlantSocial } from './PlantSocial';
import { PlantMarketplace } from './PlantMarketplace';
import { PlantAI } from './PlantAI';
import { PlantTimer } from './PlantTimer';
import { PlantWeather } from './PlantWeather';
import { PlantQuiz } from './PlantQuiz';
import { PlantPhotoGallery } from './PlantPhotoGallery';
import { PlantGenetics } from './PlantGenetics';
import { PlantSeasonalCare } from './PlantSeasonalCare';
import { PlantPestControl } from './PlantPestControl';
import { PlantPropagation } from './PlantPropagation';
import { PlantSoilAnalyzer } from './PlantSoilAnalyzer';
import { PlantHumidityTracker } from './PlantHumidityTracker';
import { PlantLightMeter } from './PlantLightMeter';
import { PlantWateringScheduler } from './PlantWateringScheduler';
import { PlantFertilizerGuide } from './PlantFertilizerGuide';
import { PlantRotationReminder } from './PlantRotationReminder';
import { PlantEmergencyGuide } from './PlantEmergencyGuide';
import { PlantVirtualGarden } from './PlantVirtualGarden';
import { PlantCareCalcluator } from './PlantCareCalculator';
import { PlantInventory } from './PlantInventory';
import { PlantWishlist } from './PlantWishlist';
import { PlantCareHistory } from './PlantCareHistory';
import { PlantHealthReport } from './PlantHealthReport';
import { PlantCareBot } from './PlantCareBot';
import { PlantWeatherAlert } from './PlantWeatherAlert';
import { PlantCommunityForum } from './PlantCommunityForum';
import { PlantExpertConsult } from './PlantExpertConsult';
import { PlantCareReminder } from './PlantCareReminder';
import { PlantGrowthPrediction } from './PlantGrowthPrediction';
import { PlantDNA } from './PlantDNA';
import { PlantEcosystem } from './PlantEcosystem';
import { PlantCareWorkshop } from './PlantCareWorkshop';
import { PlantMeditation } from './PlantMeditation';
import { PlantMusic } from './PlantMusic';
import { PlantAugmentedReality } from './PlantAugmentedReality';

// New small features
import { QuickPlantStatus } from './QuickPlantStatus';
import { PlantCareStreak } from './PlantCareStreak';
import { WeatherAlert } from './WeatherAlert';
import { PlantWateringHistory } from './PlantWateringHistory';
import { PlantGrowthChart } from './PlantGrowthChart';
import { PlantCareNotes } from './PlantCareNotes';
import { PlantHealthScore } from './PlantHealthScore';
import { QuickActions } from './QuickActions';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Play, User, LogOut, Home, Wrench, Users, BookOpen, Trophy, ShoppingCart, Bot, Cloud, Brain, Camera, Dna, Leaf, Bug, Scissors, Droplets, Sun, Timer, Calculator, Package, Heart, History, FileText, AlertTriangle, MessageSquare, UserCheck, Calendar, Zap, TreePine, GraduationCap, Music, Headphones, Glasses, Sparkles } from 'lucide-react';
import { Footer } from './Footer';

export const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userPlants, setUserPlants] = useState([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, signOut } = useAuth();
  const { startOnboarding } = useOnboarding();

  const handlePlantAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Load user plants for reminders
  useEffect(() => {
    const loadUserPlants = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_plants')
          .select('*')
          .eq('user_id', user.id);
        
        setUserPlants(data || []);
      } else {
        // Load from local storage for non-authenticated users
        const localPlants = JSON.parse(localStorage.getItem('localPlants') || '[]');
        setUserPlants(localPlants);
      }
    };

    loadUserPlants();
  }, [user, refreshTrigger]);

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
  };

  return (
    <div className="min-h-screen garden-background pb-20 lg:pb-0">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-30 dark:bg-gray-900/90">
        <Navigation />
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div data-tour="welcome" className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🌱 Plant Care Heaven
          </h1>
          <p className="text-lg text-green-700 max-w-2xl mx-auto dark:text-green-300">
            Your complete plant care ecosystem with 100+ features for the ultimate gardening experience!
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            {/* Onboarding Start Button */}
            <Button 
              onClick={startOnboarding}
              className="garden-button"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Take Tour
            </Button>

            {/* Auth Button */}
            {!user ? (
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In (Optional)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Sign In or Sign Up</DialogTitle>
                  </DialogHeader>
                  <AuthForm onSuccess={handleAuthSuccess} />
                </DialogContent>
              </Dialog>
            ) : (
              <Button 
                onClick={signOut}
                variant="outline" 
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
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

        {/* Add Plant Section - Main Interface - Always Visible */}
        <Card data-tour="add-plant" className="plant-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-3 dark:text-green-200">
              🌱 Add New Plant
            </CardTitle>
            {!user && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Plants will be saved locally. Sign in to sync across devices!
              </p>
            )}
          </CardHeader>
          <CardContent>
            <PlantSelector onPlantAdded={handlePlantAdded} />
          </CardContent>
        </Card>

        {/* Enhanced Features Dashboard - Mobile Optimized */}
        <Tabs defaultValue="dashboard" className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="flex w-max min-w-full h-auto p-1 bg-muted rounded-lg">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="quick" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Quick</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Wrench className="h-4 w-4" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Community</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Learning</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Shop</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">AI Helper</span>
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Cloud className="h-4 w-4" />
                <span className="hidden sm:inline">Weather</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="genetics" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Dna className="h-4 w-4" />
                <span className="hidden sm:inline">Science</span>
              </TabsTrigger>
              <TabsTrigger value="wellness" className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap">
                <Headphones className="h-4 w-4" />
                <span className="hidden sm:inline">Wellness</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Care Statistics */}
            {userPlants.length > 0 && <PlantCareStats plants={userPlants} />}

            {/* Comprehensive Plant Care Dashboard */}
            {userPlants.length > 0 && <PlantCareDashboard plants={userPlants} />}

            {/* Weather Widget */}
            <WeatherWidget />

            {/* Gardener Rank */}
            <GardenerRank refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="quick" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <QuickActions />
              <PlantCareStreak />
              <WeatherAlert />
              <PlantHealthScore plant={userPlants[0]} />
              <PlantCareNotes />
              <PlantGrowthChart />
            </div>
            
            {/* Quick Plant Info */}
            {userPlants.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <PlantWateringHistory plant={userPlants[0]} />
                <div className="space-y-4">
                  {userPlants.slice(0, 3).map((plant, index) => (
                    <QuickPlantStatus key={index} plant={plant} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PlantTimer />
              {userPlants.length > 0 && <PlantCompare plants={userPlants} />}
              <PlantSoilAnalyzer />
              <PlantHumidityTracker />
              <PlantLightMeter />
              <PlantCareCalcluator />
            </div>
            
            {/* Advanced Tools */}
            <div className="grid md:grid-cols-2 gap-6">
              <PlantWateringScheduler plants={userPlants} />
              <PlantFertilizerGuide />
            </div>

            {/* Smart Reminders */}
            <PlantCareReminders />

            {/* Plant Care Calendar */}
            {userPlants.length > 0 && <PlantCareCalendar plants={userPlants} />}

            {/* Disease Detection */}
            <PlantDiseaseDetector />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantSocial />
              <PlantCommunity />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantCommunityForum />
              <PlantExpertConsult />
            </div>
            
            {/* Plant Care Reminders */}
            {user && userPlants.length > 0 && (
              <PlantReminders userPlants={userPlants} />
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantQuiz />
              <RandomPlantTip />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantCareWorkshop />
              <PlantEmergencyGuide />
            </div>
            
            {userPlants.length > 0 && userPlants.slice(0, 1).map(plant => (
              <PlantJournal key={plant.id} plant={plant} />
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <PlantAchievements plants={userPlants} />
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantMarketplace />
              <PlantWishlist />
            </div>
            <PlantInventory plants={userPlants} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantAI />
              <PlantCareBot />
            </div>
            <PlantGrowthPrediction plants={userPlants} />
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantWeather />
              <PlantWeatherAlert />
            </div>
            <PlantSeasonalCare />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantPestControl />
              <PlantPropagation />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantRotationReminder plants={userPlants} />
              <PlantCareHistory plants={userPlants} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <PlantHealthReport plants={userPlants} />
              <PlantVirtualGarden plants={userPlants} />
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <PlantPhotoGallery plants={userPlants} />
            <PlantAugmentedReality />
          </TabsContent>

          <TabsContent value="genetics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantGenetics />
              <PlantDNA />
            </div>
            <PlantEcosystem plants={userPlants} />
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PlantMeditation />
              <PlantMusic />
            </div>
          </TabsContent>
        </Tabs>

        {/* Plant List */}
        <PlantList refreshTrigger={refreshTrigger} />

        {/* PWA Install Prompt */}
        <PWAInstall />

        {/* SEO Content */}
        <div className="mt-16 bg-white/80 backdrop-blur rounded-xl p-8 shadow-lg border border-green-200 dark:bg-gray-800/80 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center dark:text-green-200">
            The Ultimate Plant Care Heaven
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3 dark:text-green-300">🌿 100+ Features</h3>
              <p className="text-green-600 leading-relaxed dark:text-green-400">
                From basic watering reminders to advanced plant genetics analysis, AI-powered care recommendations, 
                and virtual reality garden experiences. Everything a plant parent could ever need in one place.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3 dark:text-green-300">🔬 Scientific Approach</h3>
              <p className="text-green-600 leading-relaxed dark:text-green-400">
                Advanced soil analysis, humidity tracking, light meters, growth prediction algorithms, 
                and disease detection powered by machine learning for professional-grade plant care.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3 dark:text-green-300">👥 Community Driven</h3>
              <p className="text-green-600 leading-relaxed dark:text-green-400">
                Connect with fellow plant enthusiasts, share experiences, get expert consultations, 
                participate in workshops, and build a thriving plant community together.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3 dark:text-green-300">🧘 Holistic Wellness</h3>
              <p className="text-green-600 leading-relaxed dark:text-green-400">
                Combine plant care with mindfulness through meditation features, plant music therapy, 
                and wellness tracking to create a complete mind-body-nature connection.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-green-700 mb-4 dark:text-green-300">Your Complete Plant Care Ecosystem</h3>
            <p className="text-green-600 leading-relaxed max-w-3xl mx-auto dark:text-green-400">
              Whether you're nurturing your first succulent or managing a botanical garden, Plant Care Heaven 
              provides everything you need. From emergency plant rescue guides to cutting-edge AR plant identification, 
              genetic analysis, and ecosystem management - we've created the most comprehensive plant care platform ever built.
            </p>
          </div>
        </div>
      </div>

      {/* Sound Settings - Fixed Position */}
      <SoundSettings />

      {/* Floating Action Button */}
      <FloatingActionButton onPlantAdded={handlePlantAdded} />

      {/* Footer */}
      <Footer />
    </div>
  );
};
