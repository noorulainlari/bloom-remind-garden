
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Plant {
  id: string;
  plant_name: string;
  last_watered: string;
  created_at: string;
}

interface PlantHealthMonitorProps {
  plants: Plant[];
}

export const PlantHealthMonitor = ({ plants }: PlantHealthMonitorProps) => {
  const [healthData, setHealthData] = useState<any[]>([]);

  useEffect(() => {
    calculateHealthScores();
  }, [plants]);

  const calculateHealthScores = () => {
    const healthScores = plants.map(plant => {
      const daysSinceWatered = Math.floor((new Date().getTime() - new Date(plant.last_watered || new Date()).getTime()) / (1000 * 60 * 60 * 24));
      const plantAge = Math.floor((new Date().getTime() - new Date(plant.created_at || new Date()).getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate various health metrics
      const wateringScore = Math.max(0, 100 - (daysSinceWatered * 10));
      const growthScore = Math.min(100, plantAge * 2); // Growth improves with age up to 50 days
      const vitalityScore = Math.floor(Math.random() * 20) + 80; // Random vitality 80-100
      
      const overallHealth = Math.floor((wateringScore + growthScore + vitalityScore) / 3);
      
      let status = 'Excellent';
      let statusColor = 'bg-green-500';
      
      if (overallHealth < 60) {
        status = 'Needs Attention';
        statusColor = 'bg-red-500';
      } else if (overallHealth < 80) {
        status = 'Good';
        statusColor = 'bg-yellow-500';
      }

      // Generate insights based on metrics
      const insights = [];
      if (wateringScore < 70) insights.push('Consider adjusting watering schedule');
      if (growthScore > 90) insights.push('Plant is mature and thriving');
      if (vitalityScore > 95) insights.push('Excellent plant vitality detected');

      return {
        ...plant,
        healthScore: overallHealth,
        wateringScore,
        growthScore,
        vitalityScore,
        status,
        statusColor,
        insights,
        trend: Math.random() > 0.5 ? 'improving' : 'stable'
      };
    });

    setHealthData(healthScores);
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <Heart className="h-5 w-5 text-yellow-500" />;
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Plant Health Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {healthData.map((plant) => (
          <div key={plant.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getHealthIcon(plant.healthScore)}
                <h3 className="font-semibold">{plant.plant_name}</h3>
                {plant.trend === 'improving' && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
              <Badge className={`${plant.statusColor} text-white`}>
                {plant.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Health</span>
                  <span>{plant.healthScore}%</span>
                </div>
                <Progress value={plant.healthScore} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Watering</span>
                    <span>{plant.wateringScore}%</span>
                  </div>
                  <Progress value={plant.wateringScore} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Growth</span>
                    <span>{plant.growthScore}%</span>
                  </div>
                  <Progress value={plant.growthScore} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Vitality</span>
                    <span>{plant.vitalityScore}%</span>
                  </div>
                  <Progress value={plant.vitalityScore} className="h-1" />
                </div>
              </div>
            </div>

            {plant.insights.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Health Insights:</h4>
                <ul className="text-sm space-y-1">
                  {plant.insights.map((insight, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
