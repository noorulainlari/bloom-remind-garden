
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

export const PlantMusic = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Music className="h-5 w-5" />
          Plant Music Therapy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Curated music for plants with growth-enhancing frequencies.</p>
      </CardContent>
    </Card>
  );
};
