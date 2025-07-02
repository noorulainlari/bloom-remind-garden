
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface PlantVirtualGardenProps {
  plants: any[];
}

export const PlantVirtualGarden = ({ plants }: PlantVirtualGardenProps) => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Globe className="h-5 w-5" />
          Virtual Garden
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">3D virtual representation of your plant collection and garden layout.</p>
      </CardContent>
    </Card>
  );
};
