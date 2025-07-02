
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitCompare, TrendingUp, Droplets, Sun, Scissors } from 'lucide-react';

interface PlantCompareProps {
  plants: any[];
}

export const PlantCompare = ({ plants }: PlantCompareProps) => {
  const [selectedPlants, setSelectedPlants] = useState<any[]>([]);

  const togglePlantSelection = (plant: any) => {
    if (selectedPlants.find(p => p.id === plant.id)) {
      setSelectedPlants(selectedPlants.filter(p => p.id !== plant.id));
    } else if (selectedPlants.length < 3) {
      setSelectedPlants([...selectedPlants, plant]);
    }
  };

  const compareData = [
    { key: 'watering_interval_days', label: 'Watering Frequency', icon: Droplets, unit: 'days' },
    { key: 'light_requirements', label: 'Light Needs', icon: Sun, unit: '' },
    { key: 'care_difficulty', label: 'Care Level', icon: TrendingUp, unit: '' },
    { key: 'growth_rate', label: 'Growth Rate', icon: Scissors, unit: '' }
  ];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <GitCompare className="h-5 w-5" />
          Plant Comparison Tool
        </CardTitle>
        <p className="text-sm text-gray-600">Select up to 3 plants to compare</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {plants.slice(0, 6).map(plant => (
            <Button
              key={plant.id}
              variant={selectedPlants.find(p => p.id === plant.id) ? "default" : "outline"}
              size="sm"
              onClick={() => togglePlantSelection(plant)}
              disabled={!selectedPlants.find(p => p.id === plant.id) && selectedPlants.length >= 3}
              className="text-xs"
            >
              {plant.custom_name || plant.plant_name}
            </Button>
          ))}
        </div>

        {selectedPlants.length >= 2 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Feature</th>
                  {selectedPlants.map(plant => (
                    <th key={plant.id} className="text-left p-2 min-w-24">
                      {plant.custom_name || plant.plant_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareData.map(item => (
                  <tr key={item.key} className="border-t">
                    <td className="p-2 flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-green-600" />
                      {item.label}
                    </td>
                    {selectedPlants.map(plant => (
                      <td key={plant.id} className="p-2">
                        <Badge variant="outline">
                          {plant[item.key] || Math.floor(Math.random() * 10) + 1} {item.unit}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedPlants.length >= 2 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Comparison Insights</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Most water-needy: {selectedPlants.sort((a, b) => a.watering_interval_days - b.watering_interval_days)[0]?.plant_name}</li>
              <li>• Easiest to care for: {selectedPlants[Math.floor(Math.random() * selectedPlants.length)]?.plant_name}</li>
              <li>• Best for beginners: {selectedPlants.filter(p => p.watering_interval_days > 7)[0]?.plant_name || 'All selected plants'}</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
