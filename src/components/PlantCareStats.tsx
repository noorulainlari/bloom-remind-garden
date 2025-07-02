
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Calendar, TrendingUp, Award } from 'lucide-react';

interface PlantCareStatsProps {
  plants: any[];
}

export const PlantCareStats = ({ plants }: PlantCareStatsProps) => {
  const totalPlants = plants.length;
  const wateredToday = plants.filter(plant => 
    plant.last_watered_timestamp && 
    new Date(plant.last_watered_timestamp).toDateString() === new Date().toDateString()
  ).length;
  const overduePlants = plants.filter(plant => 
    new Date(plant.next_water_date) < new Date()
  ).length;
  const streakDays = Math.floor(Math.random() * 30) + 1; // Mock streak data

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          📊 Care Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{totalPlants}</div>
            <div className="text-sm text-green-600">Total Plants</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{wateredToday}</div>
            <div className="text-sm text-blue-600">Watered Today</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-700">{overduePlants}</div>
            <div className="text-sm text-orange-600">Need Water</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">{streakDays}</div>
            <div className="text-sm text-purple-600">Day Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
