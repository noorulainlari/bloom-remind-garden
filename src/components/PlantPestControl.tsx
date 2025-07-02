import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, Shield, AlertTriangle, Microscope, Droplets, Leaf } from 'lucide-react';

export const PlantPestControl = () => {
  const [selectedPest, setSelectedPest] = useState('aphids');
  
  const pests = {
    aphids: {
      name: 'Aphids',
      severity: 'Medium',
      signs: ['Sticky honeydew', 'Curled leaves', 'Small green/black insects', 'Stunted growth'],
      treatment: ['Neem oil spray', 'Insecticidal soap', 'Ladybug release', 'Alcohol wipe'],
      prevention: ['Regular inspection', 'Proper spacing', 'Avoid over-fertilizing'],
      timeframe: '1-2 weeks'
    },
    spidermites: {
      name: 'Spider Mites',
      severity: 'High',
      signs: ['Fine webbing', 'Yellow speckled leaves', 'Dry conditions', 'Leaf drop'],
      treatment: ['Increase humidity', 'Miticide spray', 'Predatory mites', 'Isolation'],
      prevention: ['High humidity', 'Regular misting', 'Clean leaves'],
      timeframe: '2-3 weeks'
    },
    mealybugs: {
      name: 'Mealybugs',
      severity: 'High',
      signs: ['White cotton masses', 'Yellowing leaves', 'Sticky honeydew', 'Slow growth'],
      treatment: ['Alcohol spray', 'Systemic insecticide', 'Manual removal', 'Quarantine'],
      prevention: ['Quarantine new plants', 'Regular inspection', 'Proper hygiene'],
      timeframe: '3-4 weeks'
    }
  };

  const pestList = Object.keys(pests);
  const currentPest = pests[selectedPest];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Bug className="h-5 w-5" />
          Pest Control Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {pestList.map(pest => (
            <Button
              key={pest}
              variant={selectedPest === pest ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setSelectedPest(pest)}
              className="text-xs capitalize"
            >
              {pests[pest].name}
            </Button>
          ))}
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-red-800">{currentPest.name}</h3>
            <Badge className={getSeverityColor(currentPest.severity)}>
              {currentPest.severity} Risk
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Warning Signs
              </h4>
              <ul className="text-sm space-y-1">
                {currentPest.signs.map((sign, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                <Droplets className="h-4 w-4" />
                Treatment Options
              </h4>
              <ul className="text-sm space-y-1">
                {currentPest.treatment.map((treatment, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                    {treatment}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Prevention Tips
              </h4>
              <ul className="text-sm space-y-1">
                {currentPest.prevention.map((tip, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-3 rounded border">
              <p className="text-sm">
                <span className="font-medium">Treatment Duration:</span> {currentPest.timeframe}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            <Microscope className="h-4 w-4 mr-2" />
            Identify Pest
          </Button>
          <Button size="sm" variant="outline">
            <Leaf className="h-4 w-4 mr-2" />
            Emergency Care
          </Button>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Important Notes</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Always isolate infected plants immediately</li>
            <li>• Test treatments on small areas first</li>
            <li>• Follow product instructions carefully</li>
            <li>• Monitor plants daily during treatment</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
