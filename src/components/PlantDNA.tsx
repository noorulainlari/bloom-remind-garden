
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export const PlantDNA = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Zap className="h-5 w-5" />
          Plant DNA Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Advanced genetic analysis and trait prediction for your plants.</p>
      </CardContent>
    </Card>
  );
};
