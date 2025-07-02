
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplets, Clock } from 'lucide-react';

interface PlantWateringSchedulerProps {
  plants: any[];
}

export const PlantWateringScheduler = ({ plants }: PlantWateringSchedulerProps) => {
  const getUpcomingWatering = () => {
    return plants.slice(0, 5).map(plant => ({
      ...plant,
      daysUntil: Math.floor(Math.random() * 7),
      priority: Math.random() > 0.7 ? 'high' : 'normal'
    }));
  };

  const upcomingPlants = getUpcomingWatering();

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Calendar className="h-5 w-5" />
          Watering Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingPlants.map(plant => (
          <div key={plant.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium">{plant.custom_name || plant.plant_name}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {plant.daysUntil === 0 ? 'Today' : `${plant.daysUntil} days`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {plant.priority === 'high' && (
                <Badge className="bg-red-100 text-red-800">Urgent</Badge>
              )}
              <Droplets className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
