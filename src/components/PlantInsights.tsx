
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Target, Calendar } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface PlantInsightsProps {
  plants: Array<{
    id: string;
    plant_name: string;
    watering_interval_days: number;
    last_watered: string;
    next_water_date: string;
  }>;
  wateredCount: number;
}

export const PlantInsights = ({ plants, wateredCount }: PlantInsightsProps) => {
  const totalPlants = plants.length;
  const averageInterval = totalPlants > 0 
    ? Math.round(plants.reduce((sum, plant) => sum + plant.watering_interval_days, 0) / totalPlants)
    : 0;

  const plantsNeedingWater = plants.filter(plant => {
    const nextWaterDate = parseISO(plant.next_water_date);
    return nextWaterDate <= new Date();
  }).length;

  const longestStreak = plants.length > 0 ? Math.max(
    ...plants.map(plant => {
      const daysSinceWatered = differenceInDays(new Date(), parseISO(plant.last_watered));
      return Math.max(0, plant.watering_interval_days - daysSinceWatered);
    })
  ) : 0;

  const stats = [
    {
      title: 'Total Plants',
      value: totalPlants,
      icon: <Target className="h-5 w-5 text-green-600" />,
      color: 'text-green-600'
    },
    {
      title: 'Times Watered',
      value: wateredCount,
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Interval',
      value: `${averageInterval} days`,
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      color: 'text-purple-600'
    },
    {
      title: 'Need Water',
      value: plantsNeedingWater,
      icon: <BarChart3 className="h-5 w-5 text-orange-600" />,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-lg text-green-800 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Garden Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-white rounded-lg border border-green-100">
              <div className="flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {stat.title}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
