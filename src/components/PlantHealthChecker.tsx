
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Thermometer, Droplets, Sun, Wind, AlertTriangle, CheckCircle } from 'lucide-react';

interface PlantHealthCheckerProps {
  plant?: any;
}

interface FactorData {
  score: number;
  status: string;
  message: string;
}

export const PlantHealthChecker = ({ plant }: PlantHealthCheckerProps = {}) => {
  const [selectedPlant, setSelectedPlant] = useState('peace-lily');
  
  const plants = {
    'peace-lily': {
      name: 'Peace Lily',
      overallHealth: 78,
      factors: {
        watering: { score: 85, status: 'good', message: 'Optimal moisture level' },
        lighting: { score: 60, status: 'low', message: 'Needs more bright, indirect light' },
        temperature: { score: 90, status: 'excellent', message: 'Perfect temperature range' },
        humidity: { score: 45, status: 'critical', message: 'Too dry - increase humidity' },
        nutrition: { score: 75, status: 'good', message: 'Regular fertilization needed' },
        airflow: { score: 80, status: 'good', message: 'Good air circulation' }
      },
      symptoms: ['Leaf tips browning', 'Slow growth'],
      recommendations: [
        'Increase humidity with pebble tray',
        'Move to brighter location (no direct sun)',
        'Mist leaves regularly',
        'Check for root bound condition'
      ],
      lastCheckup: '2024-02-10'
    },
    'rubber-tree': {
      name: 'Rubber Tree',
      overallHealth: 92,
      factors: {
        watering: { score: 95, status: 'excellent', message: 'Perfect watering schedule' },
        lighting: { score: 88, status: 'good', message: 'Great light conditions' },
        temperature: { score: 92, status: 'excellent', message: 'Ideal temperature' },
        humidity: { score: 85, status: 'good', message: 'Good humidity level' },
        nutrition: { score: 90, status: 'excellent', message: 'Well-fed plant' },
        airflow: { score: 95, status: 'excellent', message: 'Excellent ventilation' }
      },
      symptoms: [],
      recommendations: [
        'Continue current care routine',
        'Consider repotting next spring',
        'Dust leaves weekly for optimal photosynthesis'
      ],
      lastCheckup: '2024-02-08'
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFactorIcon = (factor: string) => {
    switch(factor) {
      case 'watering': return <Droplets className="h-4 w-4" />;
      case 'lighting': return <Sun className="h-4 w-4" />;
      case 'temperature': return <Thermometer className="h-4 w-4" />;
      case 'humidity': return <Wind className="h-4 w-4" />;
      case 'nutrition': return <Heart className="h-4 w-4" />;
      case 'airflow': return <Wind className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const plantList = Object.keys(plants);
  const currentPlant = plants[selectedPlant];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Heart className="h-5 w-5" />
          Health Checker
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{currentPlant.name}</h3>
            <Badge className={getStatusColor(
              currentPlant.overallHealth >= 90 ? 'excellent' : 
              currentPlant.overallHealth >= 75 ? 'good' : 
              currentPlant.overallHealth >= 60 ? 'low' : 'critical'
            )}>
              {currentPlant.overallHealth}% Health
            </Badge>
          </div>
          <div className="mb-2">
            <Progress value={currentPlant.overallHealth} className="h-3" />
          </div>
          <p className="text-sm text-gray-600">Last checkup: {currentPlant.lastCheckup}</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Health Factors</h4>
          {Object.entries(currentPlant.factors).map(([factor, data]) => {
            const factorData = data as FactorData;
            return (
              <div key={factor} className="bg-white p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getFactorIcon(factor)}
                    <span className="font-medium capitalize">{factor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(factorData.score)}`}>
                      {factorData.score}%
                    </span>
                    <Badge className={getStatusColor(factorData.status)}>
                      {factorData.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={factorData.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">{factorData.message}</p>
              </div>
            );
          })}
        </div>

        {currentPlant.symptoms.length > 0 && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Symptoms Detected</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {currentPlant.symptoms.map((symptom, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full"></div>
                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Recommendations</span>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            {currentPlant.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Run Full Health Scan
        </Button>

        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-purple-800 mb-1">🔍 Health Tip</p>
          <p className="text-xs text-purple-700">
            Regular health checks help catch issues early. Schedule weekly checkups for optimal plant care.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
