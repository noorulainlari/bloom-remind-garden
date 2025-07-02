
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Camera, Ruler } from 'lucide-react';

interface PlantGrowthTrackerProps {
  plant: any;
}

export const PlantGrowthTracker = ({ plant }: PlantGrowthTrackerProps) => {
  const growthData = [
    { date: '2024-01-01', height: 15, notes: 'Initial measurement' },
    { date: '2024-02-01', height: 18, notes: 'New leaves appeared' },
    { date: '2024-03-01', height: 22, notes: 'Healthy growth' }
  ];

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <span className="font-bold text-green-800">Growth Tracking</span>
      </div>
      <div className="space-y-2">
        {growthData.map((entry, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-green-600">{entry.date}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{entry.height}cm</Badge>
              <span className="text-gray-500">{entry.notes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
