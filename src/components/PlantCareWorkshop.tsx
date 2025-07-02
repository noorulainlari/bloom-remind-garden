
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export const PlantCareWorkshop = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <GraduationCap className="h-5 w-5" />
          Care Workshops
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Interactive workshops and tutorials for advanced plant care techniques.</p>
      </CardContent>
    </Card>
  );
};
