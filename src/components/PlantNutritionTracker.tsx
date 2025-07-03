
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Beaker, TrendingUp, AlertTriangle, Plus, Target } from 'lucide-react';

export const PlantNutritionTracker = () => {
  const [selectedPlant, setSelectedPlant] = useState('monstera');
  
  const plants = {
    monstera: {
      name: 'Monstera Deliciosa',
      nutrients: {
        nitrogen: { current: 75, optimal: 80, status: 'good' },
        phosphorus: { current: 45, optimal: 60, status: 'low' },
        potassium: { current: 90, optimal: 85, status: 'high' },
        calcium: { current: 70, optimal: 75, status: 'good' },
        magnesium: { current: 30, optimal: 50, status: 'critical' },
        iron: { current: 85, optimal: 80, status: 'good' }
      },
      lastFertilized: '2024-01-15',
      nextFertilization: '2024-02-15',
      growthPhase: 'Active Growth'
    },
    fiddle: {
      name: 'Fiddle Leaf Fig',
      nutrients: {
        nitrogen: { current: 60, optimal: 70, status: 'low' },
        phosphorus: { current: 80, optimal: 75, status: 'good' },
        potassium: { current: 70, optimal: 75, status: 'good' },
        calcium: { current: 90, optimal: 85, status: 'high' },
        magnesium: { current: 65, optimal: 60, status: 'good' },
        iron: { current: 40, optimal: 70, status: 'low' }
      },
      lastFertilized: '2024-01-10',
      nextFertilization: '2024-02-10',
      growthPhase: 'Slow Growth'
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-green-600';
      case 'low': return 'text-yellow-600';
      case 'high': return 'text-blue-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const plantList = Object.keys(plants);
  const currentPlant = plants[selectedPlant];
  const nutrients = Object.entries(currentPlant.nutrients);

  const overallHealth = Math.round(
    nutrients.reduce((acc, [_, nutrient]) => acc + (nutrient.current / nutrient.optimal * 100), 0) / nutrients.length
  );

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Beaker className="h-5 w-5" />
          Nutrition Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {plantList.map(plant => (
            <Button
              key={plant}
              variant={selectedPlant === plant ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPlant(plant)}
              className="capitalize"
            >
              {plants[plant].name.split(' ')[0]}
            </Button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{currentPlant.name}</h3>
            <Badge className={getStatusBadge(overallHealth > 80 ? 'good' : overallHealth > 60 ? 'low' : 'critical')}>
              {overallHealth}% Health
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>Phase: {currentPlant.growthPhase}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Nutrient Levels</h4>
          {nutrients.map(([name, nutrient]) => (
            <div key={name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${getStatusColor(nutrient.status)}`}>
                    {nutrient.current}/{nutrient.optimal}
                  </span>
                  <Badge size="sm" className={getStatusBadge(nutrient.status)}>
                    {nutrient.status}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={(nutrient.current / nutrient.optimal) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-yellow-800">Fertilization Schedule</span>
          </div>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>Last fertilized: {currentPlant.lastFertilized}</p>
            <p>Next fertilization: {currentPlant.nextFertilization}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Fertilizer
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Trends
          </Button>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">🌱 Nutrition Tip</p>
          <p className="text-xs text-blue-700">
            {currentPlant.growthPhase === 'Active Growth' 
              ? 'Increase nitrogen during active growth periods for healthy foliage development.'
              : 'Reduce fertilization frequency during slow growth periods to prevent nutrient buildup.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
