
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const PlantWeatherAlert = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <AlertTriangle className="h-5 w-5" />
          Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Get alerts for weather conditions that might affect your plants.</p>
      </CardContent>
    </Card>
  );
};
