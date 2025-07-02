
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

interface PlantCareHistoryProps {
  plants: any[];
}

export const PlantCareHistory = ({ plants }: PlantCareHistoryProps) => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <History className="h-5 w-5" />
          Care History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">View detailed history of all plant care activities and treatments.</p>
      </CardContent>
    </Card>
  );
};
