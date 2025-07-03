import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Leaf,
  Wrench,
  Users,
  BookOpen,
  Heart,
  Zap,
  BarChart3,
  Crown,
  Sparkles
} from "lucide-react";
import { PlantDiseaseDetector } from './PlantDiseaseDetector';
import { PlantNutritionTracker } from './PlantNutritionTracker';
import { PlantGrowthTracker } from './PlantGrowthTracker';
import { PlantHealthChecker } from './PlantHealthChecker';
import { PlantMoodTracker } from './PlantMoodTracker';
import { PlantInsights } from './PlantInsights';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container py-8">
      <div className="space-y-4">
        <div className="pb-20 lg:pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 bg-white z-10 pb-4">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 h-auto p-1 bg-muted overflow-x-auto">
                <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <Wrench className="h-4 w-4" />
                  <span className="hidden sm:inline">Tools</span>
                </TabsTrigger>
                <TabsTrigger value="community" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Community</span>
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Learning</span>
                </TabsTrigger>
                <TabsTrigger value="health" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Health</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
                <TabsTrigger value="care" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">Care</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="premium" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <Crown className="h-4 w-4" />
                  <span className="hidden sm:inline">Premium</span>
                </TabsTrigger>
                <TabsTrigger value="extras" className="flex flex-col items-center gap-1 px-2 py-3 text-xs">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Extras</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-4">
              <TabsContent value="dashboard" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Dashboard Content
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="tools" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Tools Content
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="community" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Community Content
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="learning" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Learning Content
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="health" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    <PlantHealthChecker />
                    <PlantDiseaseDetector />
                    <PlantMoodTracker />
                    <PlantNutritionTracker />
                    <PlantGrowthTracker />
                    <PlantInsights />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Advanced Content
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="care" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Care Content
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="analysis" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Analysis Content
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="premium" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Premium Content
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="extras" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                    Extras Content
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
