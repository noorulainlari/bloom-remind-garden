
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartWateringSchedule } from './SmartWateringSchedule';
import { PlantHealthMonitor } from './PlantHealthMonitor';
import { DiseaseScanner } from './DiseaseScanner';
import { GrowthAnalytics } from './GrowthAnalytics';
import { Sparkles, Droplets, Heart, Microscope, BarChart3, X } from 'lucide-react';

interface FeatureHubProps {
  plants: any[];
  onWaterPlant: (plantId: string) => void;
  onClose: () => void;
}

export const FeatureHub = ({ plants, onWaterPlant, onClose }: FeatureHubProps) => {
  const [activeFeature, setActiveFeature] = useState('watering');

  const features = [
    {
      id: 'watering',
      name: 'Smart Watering',
      icon: Droplets,
      component: SmartWateringSchedule,
      description: 'AI-powered watering recommendations'
    },
    {
      id: 'health',
      name: 'Health Monitor',
      icon: Heart,
      component: PlantHealthMonitor,
      description: 'Real-time plant health tracking'
    },
    {
      id: 'disease',
      name: 'Disease Scanner',
      icon: Microscope,
      component: DiseaseScanner,
      description: 'AI disease detection from photos'
    },
    {
      id: 'analytics',
      name: 'Growth Analytics',
      icon: BarChart3,
      component: GrowthAnalytics,
      description: 'Detailed growth analysis and insights'
    }
  ];

  const renderActiveFeature = () => {
    const feature = features.find(f => f.id === activeFeature);
    if (!feature) return null;

    const Component = feature.component;
    
    // Add proper error handling and ensure all required props are passed
    try {
      switch (activeFeature) {
        case 'watering':
          return <Component plants={plants || []} onWaterPlant={onWaterPlant} />;
        case 'health':
          return <Component plants={plants || []} />;
        case 'analytics':
          return <Component plants={plants || []} />;
        case 'disease':
          return <Component />;
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering feature component:', error);
      return (
        <div className="p-4 text-center text-red-600">
          <p>Unable to load this feature. Please try refreshing the page.</p>
        </div>
      );
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Plant Care Feature Hub
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeFeature} onValueChange={setActiveFeature}>
          <TabsList className="grid w-full grid-cols-4">
            {features.map(feature => (
              <TabsTrigger key={feature.id} value={feature.id} className="flex items-center gap-2">
                <feature.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{feature.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mt-6">
            {renderActiveFeature()}
          </div>
        </Tabs>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">🚀 More Features Coming Soon!</h3>
          <p className="text-purple-600 text-sm">
            We're continuously adding new AI-powered features like pest identification, 
            fertilizer optimization, companion planting suggestions, and much more!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
