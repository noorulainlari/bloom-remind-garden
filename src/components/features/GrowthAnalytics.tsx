
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';

interface Plant {
  id: string;
  plant_name: string;
  created_at: string;
  last_watered: string;
}

interface GrowthAnalyticsProps {
  plants: Plant[];
}

export const GrowthAnalytics = ({ plants }: GrowthAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  useEffect(() => {
    calculateGrowthAnalytics();
  }, [plants, selectedTimeframe]);

  const calculateGrowthAnalytics = () => {
    const analyticsData = plants.map(plant => {
      const plantAge = Math.floor((new Date().getTime() - new Date(plant.created_at).getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceWatered = Math.floor((new Date().getTime() - new Date(plant.last_watered || new Date()).getTime()) / (1000 * 60 * 60 * 24));
      
      // Mock growth metrics - in real app, these would come from actual measurements
      const baseGrowth = Math.min(plantAge * 0.5, 25); // Max 25cm growth
      const growthRate = baseGrowth / Math.max(plantAge, 1);
      const healthFactor = Math.max(0.5, 1 - (daysSinceWatered * 0.1));
      
      const currentHeight = Math.floor(baseGrowth * healthFactor) + 15; // Base height 15cm
      const projectedGrowth = growthRate * 30 * healthFactor; // 30-day projection
      
      // Generate growth data points for the chart
      const growthHistory = [];
      for (let i = Math.min(plantAge, 30); i >= 0; i--) {
        const dayHeight = 15 + (baseGrowth * (plantAge - i) / plantAge * healthFactor);
        growthHistory.push({
          day: i,
          height: Math.floor(dayHeight),
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()
        });
      }

      // Calculate growth insights
      const insights = [];
      if (growthRate > 0.8) insights.push('Excellent growth rate detected');
      if (daysSinceWatered > 5) insights.push('Growth may slow due to watering delay');
      if (plantAge > 60) insights.push('Plant entering mature growth phase');
      if (healthFactor < 0.7) insights.push('Consider improving care routine');

      const trend = growthRate > 0.5 ? 'increasing' : growthRate > 0.2 ? 'stable' : 'decreasing';

      return {
        ...plant,
        currentHeight,
        growthRate: Math.round(growthRate * 100) / 100,
        projectedGrowth: Math.round(projectedGrowth * 100) / 100,
        healthFactor: Math.round(healthFactor * 100),
        growthHistory,
        insights,
        trend,
        plantAge
      };
    });

    setAnalytics(analyticsData);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-yellow-500" />;
      default: return <BarChart3 className="h-4 w-4 text-red-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'bg-green-500';
      case 'stable': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Growth Analytics Dashboard
          </CardTitle>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {analytics.map((plant) => (
          <div key={plant.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{plant.plant_name}</h3>
                {getTrendIcon(plant.trend)}
              </div>
              <Badge className={`${getTrendColor(plant.trend)} text-white`}>
                {plant.trend.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{plant.currentHeight}cm</div>
                <div className="text-sm text-blue-500">Current Height</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{plant.growthRate}cm/day</div>
                <div className="text-sm text-green-500">Growth Rate</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{plant.projectedGrowth}cm</div>
                <div className="text-sm text-purple-500">30-Day Projection</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{plant.plantAge}d</div>
                <div className="text-sm text-orange-500">Plant Age</div>
              </div>
            </div>

            {/* Simple growth chart visualization */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Growth History ({selectedTimeframe})
              </h4>
              <div className="h-24 bg-gray-50 rounded-lg p-2 flex items-end justify-between">
                {plant.growthHistory.slice(-7).map((point: any, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-green-500 w-4 rounded-t"
                      style={{ height: `${(point.height / plant.currentHeight) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1">{point.day}d</span>
                  </div>
                ))}
              </div>
            </div>

            {plant.insights.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Growth Insights:
                </h4>
                <ul className="text-sm space-y-1">
                  {plant.insights.map((insight: string, index: number) => (
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

        {analytics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Add some plants to start tracking growth analytics!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
