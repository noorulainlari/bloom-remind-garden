
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TestTube, Droplets, Zap, Thermometer, AlertCircle } from 'lucide-react';

export const PlantSoilAnalyzer = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState({
    ph: 6.5,
    moisture: 45,
    nutrients: {
      nitrogen: 70,
      phosphorus: 55,
      potassium: 80
    },
    salinity: 25,
    temperature: 22
  });

  const startTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      // Simulate new results
      setResults({
        ph: Math.random() * 4 + 5, // 5-9 pH range
        moisture: Math.random() * 100,
        nutrients: {
          nitrogen: Math.random() * 100,
          phosphorus: Math.random() * 100,
          potassium: Math.random() * 100
        },
        salinity: Math.random() * 50,
        temperature: Math.random() * 10 + 18 // 18-28°C
      });
    }, 3000);
  };

  const getPhStatus = (ph: number) => {
    if (ph < 6) return { status: 'Acidic', color: 'text-red-600', bg: 'bg-red-50' };
    if (ph > 7.5) return { status: 'Alkaline', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { status: 'Optimal', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const getMoistureStatus = (moisture: number) => {
    if (moisture < 30) return { status: 'Dry', color: 'text-red-600' };
    if (moisture > 70) return { status: 'Wet', color: 'text-blue-600' };
    return { status: 'Good', color: 'text-green-600' };
  };

  const phStatus = getPhStatus(results.ph);
  const moistureStatus = getMoistureStatus(results.moisture);

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <TestTube className="h-5 w-5" />
          Soil Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={startTest} 
          disabled={testing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {testing ? (
            <>
              <TestTube className="h-4 w-4 mr-2 animate-pulse" />
              Testing Soil...
            </>
          ) : (
            <>
              <TestTube className="h-4 w-4 mr-2" />
              Start Soil Test
            </>
          )}
        </Button>

        {!testing && (
          <div className="space-y-4">
            {/* pH Level */}
            <div className={`p-3 rounded-lg ${phStatus.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">pH Level</span>
                <Badge className={phStatus.color}>{phStatus.status}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{results.ph.toFixed(1)}</div>
              <Progress value={(results.ph - 4) * 20} className="h-2" />
              <div className="text-xs text-gray-600 mt-1">Optimal range: 6.0 - 7.0</div>
            </div>

            {/* Moisture */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Moisture
                </span>
                <Badge className={moistureStatus.color}>{moistureStatus.status}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{Math.round(results.moisture)}%</div>
              <Progress value={results.moisture} className="h-2" />
            </div>

            {/* Nutrients */}
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Nutrient Levels
              </h4>
              <div className="space-y-3">
                {Object.entries(results.nutrients).map(([nutrient, value]) => (
                  <div key={nutrient}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{nutrient} (N-P-K)</span>
                      <span>{Math.round(value)}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                <div className="text-sm font-medium">Salinity</div>
                <div className="text-lg font-bold">{Math.round(results.salinity)}%</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <Thermometer className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <div className="text-sm font-medium">Temperature</div>
                <div className="text-lg font-bold">{Math.round(results.temperature)}°C</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Recommendations</span>
              </div>
              <ul className="text-sm text-orange-700 space-y-1">
                {results.ph < 6 && <li>• Add lime to increase pH</li>}
                {results.ph > 7.5 && <li>• Add sulfur to decrease pH</li>}
                {results.moisture < 30 && <li>• Increase watering frequency</li>}
                {results.moisture > 70 && <li>• Improve drainage</li>}
                {results.nutrients.nitrogen < 50 && <li>• Add nitrogen-rich fertilizer</li>}
                {results.salinity > 30 && <li>• Flush soil with distilled water</li>}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-800 mb-1">📊 Testing Tips</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Test soil when slightly moist, not wet</li>
            <li>• Take samples from multiple spots</li>
            <li>• Test monthly for best results</li>
            <li>• Calibrate sensors regularly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
