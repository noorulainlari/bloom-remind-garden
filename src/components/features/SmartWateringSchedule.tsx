
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplets, Calendar, Clock, Thermometer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Plant {
  id: string;
  plant_name: string;
  watering_interval_days: number;
  last_watered: string;
  next_water_date: string;
}

interface SmartWateringScheduleProps {
  plants: Plant[];
  onWaterPlant: (plantId: string) => void;
}

export const SmartWateringSchedule = ({ plants, onWaterPlant }: SmartWateringScheduleProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    generateRecommendations();
  }, [plants]);

  const generateRecommendations = () => {
    // Add error handling to prevent undefined errors
    if (!plants || !Array.isArray(plants)) {
      console.warn('Plants data is not available or invalid');
      setRecommendations([]);
      return;
    }

    const today = new Date();
    const weather = getWeatherCondition();
    
    const recs = plants.map(plant => {
      // Add safety checks for plant properties
      if (!plant || typeof plant !== 'object') {
        console.warn('Invalid plant object:', plant);
        return null;
      }

      const plantName = plant.plant_name || 'Unknown Plant';
      const nextWaterDate = plant.next_water_date;
      
      // Safety check for date parsing
      let daysUntilWater = 0;
      if (nextWaterDate && typeof nextWaterDate === 'string') {
        try {
          const nextWater = new Date(nextWaterDate);
          if (!isNaN(nextWater.getTime())) {
            daysUntilWater = Math.ceil((nextWater.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          }
        } catch (error) {
          console.warn('Error parsing next water date:', nextWaterDate, error);
        }
      }
      
      let recommendation = 'On Schedule';
      let priority = 'low';
      let adjustedDays = daysUntilWater;

      // AI-powered adjustments based on conditions
      if (weather.temperature > 30 && weather.humidity < 40) {
        adjustedDays -= 1;
        recommendation = 'Water Early (Hot & Dry)';
        priority = 'high';
      } else if (weather.humidity > 80) {
        adjustedDays += 1;
        recommendation = 'Delay Watering (High Humidity)';
        priority = 'low';
      }

      if (daysUntilWater <= 0) {
        recommendation = 'Needs Water Now!';
        priority = 'urgent';
      }

      return {
        ...plant,
        plant_name: plantName,
        recommendation,
        priority,
        adjustedDays,
        weather: weather
      };
    }).filter(Boolean); // Remove any null entries

    setRecommendations(recs);
  };

  const getWeatherCondition = () => {
    // Mock weather data - in real app, this would fetch from weather API
    return {
      temperature: Math.floor(Math.random() * 20) + 20, // 20-40°C
      humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)]
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const handleWaterNow = (plantId: string) => {
    if (typeof onWaterPlant === 'function') {
      onWaterPlant(plantId);
      toast({
        title: "🌱 Plant Watered!",
        description: "Smart watering schedule updated based on current conditions.",
      });
      generateRecommendations();
    }
  };

  // Handle case when no plants are available
  if (!plants || plants.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Smart Watering Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Droplets className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No plants found. Add some plants to get watering recommendations!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          Smart Watering Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id || Math.random()} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{rec.plant_name || 'Unknown Plant'}</h3>
              <Badge className={`${getPriorityColor(rec.priority)} text-white`}>
                {(rec.priority || 'low').toUpperCase()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Next: {rec.adjustedDays || 0}d</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span>{rec.weather?.temperature || 25}°C</span>
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded text-sm">
              <strong>AI Recommendation:</strong> {rec.recommendation || 'No recommendation available'}
            </div>

            {rec.priority === 'urgent' && (
              <Button 
                onClick={() => handleWaterNow(rec.id)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Droplets className="h-4 w-4 mr-2" />
                Water Now
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
