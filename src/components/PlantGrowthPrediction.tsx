
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PlantGrowthPredictionProps {
  plants: any[];
}

export const PlantGrowthPrediction = ({ plants }: PlantGrowthPredictionProps) => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <TrendingUp className="h-5 w-5" />
          Growth Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">AI-powered growth predictions based on care history and environment.</p>
      </CardContent>
    </Card>
  );
};
