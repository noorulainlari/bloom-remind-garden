
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Camera, Ruler, Calendar, BarChart3, Leaf } from 'lucide-react';

export const PlantGrowthTracker = () => {
  const [selectedPlant, setSelectedPlant] = useState('pothos');
  
  const plants = {
    pothos: {
      name: 'Golden Pothos',
      measurements: [
        { date: '2024-01-01', height: 15, width: 20, leaves: 12, health: 85 },
        { date: '2024-01-15', height: 17, width: 22, leaves: 14, health: 88 },
        { date: '2024-02-01', height: 19, width: 25, leaves: 16, health: 92 },
        { date: '2024-02-15', height: 22, width: 28, leaves: 18, health: 95 }
      ],
      growthRate: '+15%',
      plantedDate: '2023-10-15',
      variety: 'Epipremnum aureum'
    },
    snake: {
      name: 'Snake Plant',
      measurements: [
        { date: '2024-01-01', height: 30, width: 15, leaves: 8, health: 90 },
        { date: '2024-01-15', height: 31, width: 16, leaves: 9, health: 92 },
        { date: '2024-02-01', height: 33, width: 17, leaves: 10, health: 88 },
        { date: '2024-02-15', height: 35, width: 18, leaves: 11, health: 90 }
      ],
      growthRate: '+8%',
      plantedDate: '2023-08-20',
      variety: 'Sansevieria trifasciata'
    }
  };

  const plantList = Object.keys(plants);
  const currentPlant = plants[selectedPlant];
  const latestMeasurement = currentPlant.measurements[currentPlant.measurements.length - 1];
  const previousMeasurement = currentPlant.measurements[currentPlant.measurements.length - 2];

  const getGrowthTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous * 100).toFixed(1);
    return parseFloat(change) > 0 ? `+${change}%` : `${change}%`;
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'bg-green-100 text-green-800';
    if (health >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <TrendingUp className="h-5 w-5" />
          Growth Tracker
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

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold">{currentPlant.name}</h3>
              <p className="text-sm text-gray-600">{currentPlant.variety}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {currentPlant.growthRate} Growth
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Planted: {currentPlant.plantedDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Current Stats</h4>
            
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Height</span>
                <span className="text-green-600 text-xs">
                  {getGrowthTrend(latestMeasurement.height, previousMeasurement.height)}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{latestMeasurement.height}cm</div>
            </div>

            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Width</span>
                <span className="text-blue-600 text-xs">
                  {getGrowthTrend(latestMeasurement.width, previousMeasurement.width)}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{latestMeasurement.width}cm</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Health Metrics</h4>
            
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Leaves</span>
                <Leaf className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{latestMeasurement.leaves}</div>
            </div>

            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Health</span>
                <Badge className={getHealthColor(latestMeasurement.health)}>
                  {latestMeasurement.health}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-800">{latestMeasurement.health}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-800">Growth Timeline</h4>
          <div className="space-y-2">
            {currentPlant.measurements.slice(-3).reverse().map((measurement, index) => (
              <div key={measurement.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{measurement.date}</span>
                <div className="flex gap-3 text-xs">
                  <span>H: {measurement.height}cm</span>
                  <span>W: {measurement.width}cm</span>
                  <span>L: {measurement.leaves}</span>
                  <Badge size="sm" className={getHealthColor(measurement.health)}>
                    {measurement.health}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="outline">
            <Camera className="h-4 w-4 mr-1" />
            Photo
          </Button>
          <Button size="sm" variant="outline">
            <Ruler className="h-4 w-4 mr-1" />
            Measure
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <BarChart3 className="h-4 w-4 mr-1" />
            Report
          </Button>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-1">📈 Growth Insight</p>
          <p className="text-xs text-green-700">
            Your {currentPlant.name} is showing excellent growth! The consistent increase in leaf count indicates healthy development.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
