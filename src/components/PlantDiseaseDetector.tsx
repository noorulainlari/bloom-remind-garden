
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, AlertTriangle } from 'lucide-react';

export const PlantDiseaseDetector = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis({
        disease: 'Leaf Spot',
        confidence: 87,
        treatment: 'Remove affected leaves and improve air circulation',
        severity: 'Moderate',
        prevention: 'Avoid watering leaves directly'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Search className="h-5 w-5" />
          Disease Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Take a photo of your plant to detect diseases</p>
            <Button onClick={analyzeImage} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Upload Photo'}
            </Button>
          </div>

          {analysis && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Analysis Results</h3>
                <Badge variant={analysis.severity === 'Severe' ? 'destructive' : 'secondary'}>
                  {analysis.confidence}% confident
                </Badge>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">{analysis.disease}</span>
                </div>
                <p className="text-sm text-red-700 mb-2"><strong>Treatment:</strong> {analysis.treatment}</p>
                <p className="text-sm text-red-700"><strong>Prevention:</strong> {analysis.prevention}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
