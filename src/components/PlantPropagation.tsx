
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scissors, Droplets, Sprout, Clock, Camera, CheckCircle } from 'lucide-react';

export const PlantPropagation = () => {
  const [selectedMethod, setSelectedMethod] = useState('water');
  const [activeProjects, setActiveProjects] = useState([
    { id: 1, plant: 'Pothos', method: 'water', day: 12, status: 'rooting' },
    { id: 2, plant: 'Snake Plant', method: 'soil', day: 8, status: 'callusing' }
  ]);

  const methods = {
    water: {
      name: 'Water Propagation',
      difficulty: 'Beginner',
      time: '2-4 weeks',
      success: '85%',
      steps: [
        'Cut 4-6 inch stem with nodes',
        'Remove lower leaves',
        'Place in clean water',
        'Change water every 3 days',
        'Wait for 2+ inch roots',
        'Transplant to soil'
      ],
      tips: ['Use filtered water', 'Bright indirect light', 'Add rooting hormone for faster results']
    },
    soil: {
      name: 'Soil Propagation',
      difficulty: 'Intermediate',
      time: '3-6 weeks',
      success: '70%',
      steps: [
        'Prepare well-draining mix',
        'Cut healthy stem cutting',
        'Dip in rooting hormone',
        'Plant in moist soil',
        'Cover with plastic bag',
        'Keep soil consistently moist'
      ],
      tips: ['Use seed starting mix', 'Bottom heat helps', 'Maintain high humidity']
    },
    division: {
      name: 'Plant Division',
      difficulty: 'Easy',
      time: '1-2 weeks',
      success: '95%',
      steps: [
        'Remove plant from pot',
        'Gently separate roots',
        'Ensure each division has roots',
        'Plant in fresh soil',
        'Water thoroughly',
        'Monitor for stress'
      ],
      tips: ['Best done in spring', 'Use clean tools', 'Don\'t disturb roots too much']
    }
  };

  const methodList = Object.keys(methods);
  const currentMethod = methods[selectedMethod];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Scissors className="h-5 w-5" />
          Propagation Station
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {methodList.map(method => (
            <Button
              key={method}
              variant={selectedMethod === method ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMethod(method)}
              className="text-xs"
            >
              {methods[method].name.split(' ')[0]}
            </Button>
          ))}
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-green-800">{currentMethod.name}</h3>
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(currentMethod.difficulty)}>
                {currentMethod.difficulty}
              </Badge>
              <Badge variant="outline">
                {currentMethod.success} Success
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span>{currentMethod.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-green-600" />
              <span>{currentMethod.success} Success Rate</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Step-by-Step Guide</h4>
              <ol className="space-y-2">
                {currentMethod.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="font-medium mb-2">Pro Tips</h4>
              {currentMethod.tips.map((tip, index) => (
                <p key={index} className="text-sm text-gray-700 italic mb-1">
                  💡 {tip}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Active Projects</h4>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Scissors className="h-4 w-4 mr-2" />
              Start New
            </Button>
          </div>
          
          {activeProjects.map(project => (
            <div key={project.id} className="bg-white p-3 rounded border flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{project.plant}</p>
                <p className="text-xs text-gray-500 capitalize">{project.method} • Day {project.day} • {project.status}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">🌱 Propagation Calendar</p>
          <p className="text-xs text-blue-700">
            Best time for propagation: Spring (March-May) when plants are actively growing and recovery is fastest.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
