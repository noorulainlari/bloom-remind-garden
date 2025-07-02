
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Sun, Snowflake, Flower2, Leaf, Droplets, Thermometer } from 'lucide-react';

export const PlantSeasonalCare = () => {
  const [selectedSeason, setSelectedSeason] = useState('spring');
  
  const seasonalCare = {
    spring: {
      icon: Flower2,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      tasks: [
        'Increase watering frequency',
        'Start fertilizing regime', 
        'Repot if needed',
        'Prune dead growth',
        'Check for pests'
      ],
      tips: [
        'Growth season begins - plants need more nutrients',
        'Perfect time for propagation',
        'Monitor for rapid growth spurts',
        'Gradually move plants to brighter locations'
      ]
    },
    summer: {
      icon: Sun,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      tasks: [
        'Water more frequently',
        'Provide extra humidity',
        'Shield from intense sun',
        'Monitor soil moisture',
        'Increase air circulation'
      ],
      tips: [
        'Peak growing season - maximum care needed',
        'Watch for heat stress signs',
        'Early morning watering is best',
        'Consider moving plants away from hot windows'
      ]
    },
    fall: {
      icon: Leaf,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      tasks: [
        'Reduce fertilizing',
        'Decrease watering',
        'Bring outdoor plants in',
        'Prepare for dormancy',
        'Clean plant leaves'
      ],
      tips: [
        'Plants slow down growth - adjust care accordingly',
        'Perfect time for final propagation',
        'Check for pests before bringing plants indoors',
        'Gradually reduce light exposure'
      ]
    },
    winter: {
      icon: Snowflake,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      tasks: [
        'Minimal watering',
        'Stop fertilizing',
        'Increase humidity',
        'Provide grow lights',
        'Avoid cold drafts'
      ],
      tips: [
        'Dormancy period - minimal intervention needed',
        'Watch for overwatering in low light',
        'Maintain stable temperatures',
        'Consider supplemental lighting'
      ]
    }
  };

  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const currentSeason = seasonalCare[selectedSeason];
  const SeasonIcon = currentSeason.icon;

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Calendar className="h-5 w-5" />
          Seasonal Care Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {seasons.map(season => {
            const seasonData = seasonalCare[season];
            const Icon = seasonData.icon;
            return (
              <Button
                key={season}
                variant={selectedSeason === season ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSeason(season)}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Icon className={`h-4 w-4 ${seasonData.color}`} />
                <span className="capitalize text-xs">{season}</span>
              </Button>
            );
          })}
        </div>

        <div className={`${currentSeason.bg} p-4 rounded-lg`}>
          <div className="flex items-center gap-2 mb-3">
            <SeasonIcon className={`h-6 w-6 ${currentSeason.color}`} />
            <h3 className="font-semibold capitalize">{selectedSeason} Care</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Essential Tasks</h4>
              <div className="space-y-1">
                {currentSeason.tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                    {task}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Pro Tips</h4>
              <div className="space-y-2">
                {currentSeason.tips.map((tip, index) => (
                  <p key={index} className="text-sm text-gray-700 italic">
                    💡 {tip}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Thermometer className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-medium">Temperature</p>
            <p className="text-xs text-gray-600">18-24°C</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Droplets className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs font-medium">Humidity</p>
            <p className="text-xs text-gray-600">40-60%</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <Sun className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
            <p className="text-xs font-medium">Light</p>
            <p className="text-xs text-gray-600">Bright Indirect</p>
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-1">🌱 Seasonal Reminder</p>
          <p className="text-xs text-green-700">
            Plants follow natural cycles. Adjusting your care routine seasonally will keep them healthier and more resilient year-round.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
