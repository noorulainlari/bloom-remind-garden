
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, Beaker } from 'lucide-react';

export const PlantFertilizerGuide = () => {
  const fertilizers = [
    { type: 'Balanced (10-10-10)', best: 'Most houseplants', frequency: 'Monthly', season: 'Spring-Summer' },
    { type: 'High Nitrogen (20-10-10)', best: 'Leafy plants', frequency: 'Bi-weekly', season: 'Growing season' },
    { type: 'Bloom Booster (10-30-20)', best: 'Flowering plants', frequency: 'Weekly', season: 'Blooming period' }
  ];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Beaker className="h-5 w-5" />
          Fertilizer Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fertilizers.map((fert, index) => (
          <div key={index} className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{fert.type}</h4>
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-2">{fert.best}</p>
            <div className="flex gap-2">
              <Badge variant="outline">{fert.frequency}</Badge>
              <Badge variant="outline">{fert.season}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
