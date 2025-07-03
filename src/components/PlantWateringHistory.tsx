
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Droplets } from 'lucide-react';

interface PlantWateringHistoryProps {
  plant?: any;
}

export const PlantWateringHistory = ({ plant }: PlantWateringHistoryProps) => {
  const wateringHistory = [
    { date: '2024-01-15', amount: 'Normal', notes: 'Soil felt dry' },
    { date: '2024-01-12', amount: 'Light', notes: 'Quick watering' },
    { date: '2024-01-09', amount: 'Normal', notes: 'Regular schedule' }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          Watering History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {wateringHistory.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded border">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">{entry.date}</div>
                  <div className="text-xs text-gray-500">{entry.notes}</div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {entry.amount}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
