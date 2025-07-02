
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const PlantEmergencyGuide = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <AlertTriangle className="h-5 w-5" />
          Emergency Care Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Quick solutions for plant emergencies and crisis situations.</p>
      </CardContent>
    </Card>
  );
};
