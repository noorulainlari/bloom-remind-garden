
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, AlertCircle, CheckCircle, Eye, Upload, Zap } from 'lucide-react';

export const PlantDiseaseDetector = () => {
  const [selectedDisease, setSelectedDisease] = useState('leaf-spot');
  
  const diseases = {
    'leaf-spot': {
      name: 'Leaf Spot Disease',
      severity: 'Medium',
      symptoms: ['Brown/black spots on leaves', 'Yellowing around spots', 'Leaf drop', 'Circular lesions'],
      causes: ['Overwatering', 'Poor air circulation', 'High humidity', 'Fungal infection'],
      treatment: ['Remove affected leaves', 'Improve air circulation', 'Apply fungicide', 'Reduce watering'],
      prevention: ['Water at soil level', 'Space plants properly', 'Morning watering', 'Clean tools'],
      confidence: 85
    },
    'powdery-mildew': {
      name: 'Powdery Mildew',
      severity: 'High',
      symptoms: ['White powdery coating', 'Distorted leaves', 'Stunted growth', 'Yellowing leaves'],
      causes: ['High humidity', 'Poor ventilation', 'Overcrowding', 'Low light'],
      treatment: ['Baking soda spray', 'Neem oil application', 'Increase air flow', 'Remove infected parts'],
      prevention: ['Proper spacing', 'Good ventilation', 'Avoid overhead watering', 'Regular inspection'],
      confidence: 92
    },
    'root-rot': {
      name: 'Root Rot',
      severity: 'Critical',
      symptoms: ['Wilting despite moist soil', 'Yellow/brown leaves', 'Musty smell', 'Black roots'],
      causes: ['Overwatering', 'Poor drainage', 'Contaminated soil', 'Fungal pathogens'],
      treatment: ['Stop watering immediately', 'Remove from pot', 'Trim black roots', 'Repot in fresh soil'],
      prevention: ['Well-draining soil', 'Proper pot size', 'Water scheduling', 'Good drainage holes'],
      confidence: 78
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const diseaseList = Object.keys(diseases);
  const currentDisease = diseases[selectedDisease];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Eye className="h-5 w-5" />
          AI Disease Detector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
          <Button variant="outline" className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {diseaseList.map(disease => (
            <Button
              key={disease}
              variant={selectedDisease === disease ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDisease(disease)}
              className="justify-start text-left"
            >
              {diseases[disease].name}
            </Button>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">{currentDisease.name}</h3>
            <div className="flex gap-2">
              <Badge className={getSeverityColor(currentDisease.severity)}>
                {currentDisease.severity}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                {currentDisease.confidence}% Match
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Symptoms Detected
              </h4>
              <ul className="text-sm space-y-1">
                {currentDisease.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-orange-700 mb-2">Possible Causes</h4>
              <ul className="text-sm space-y-1">
                {currentDisease.causes.map((cause, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full"></div>
                    {cause}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Treatment Plan
              </h4>
              <ul className="text-sm space-y-1">
                {currentDisease.treatment.map((treatment, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                    {treatment}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-700 mb-2">Prevention Tips</h4>
              <ul className="text-sm space-y-1">
                {currentDisease.prevention.map((tip, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
          <Zap className="h-4 w-4 mr-2" />
          Get Expert Diagnosis
        </Button>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">💡 Pro Tip</p>
          <p className="text-xs text-blue-700">
            Early detection is key! Check your plants weekly and take photos to track changes over time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
