
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

interface PlantRotationReminderProps {
  plants: any[];
}

export const PlantRotationReminder = ({ plants }: PlantRotationReminderProps) => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <RotateCcw className="h-5 w-5" />
          Rotation Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Smart reminders to rotate plants for even growth and light exposure.</p>
      </CardContent>
    </Card>
  );
};
