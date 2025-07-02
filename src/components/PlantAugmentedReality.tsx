
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Glasses } from 'lucide-react';

export const PlantAugmentedReality = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Glasses className="h-5 w-5" />
          AR Plant Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Augmented reality plant identification and care visualization.</p>
      </CardContent>
    </Card>
  );
};
