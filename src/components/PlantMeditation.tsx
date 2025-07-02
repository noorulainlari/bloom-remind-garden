
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones } from 'lucide-react';

export const PlantMeditation = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Headphones className="h-5 w-5" />
          Plant Meditation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Guided meditation sessions for mindful plant care and connection.</p>
      </CardContent>
    </Card>
  );
};
