
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export const PlantCareCalcluator = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Calculator className="h-5 w-5" />
          Care Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Calculate optimal care schedules based on plant size, pot type, and environment.</p>
      </CardContent>
    </Card>
  );
};
