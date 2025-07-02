
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export const PlantCareReminder = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Calendar className="h-5 w-5" />
          Smart Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Advanced reminder system with customizable notifications.</p>
      </CardContent>
    </Card>
  );
};
