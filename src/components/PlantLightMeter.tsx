
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Cloud, Lightbulb, MapPin } from 'lucide-react';

export const PlantLightMeter = () => {
  const [lightLevel, setLightLevel] = useState(850);
  const [isReading, setIsReading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('window');

  const locations = {
    window: { name: 'Near Window', ideal: '1000-2000 lux', current: 1200 },
    desk: { name: 'Desk Area', ideal: '200-500 lux', current: 350 },
    corner: { name: 'Room Corner', ideal: '100-200 lux', current: 150 },
    bathroom: { name: 'Bathroom', ideal: '500-1000 lux', current: 600 }
  };

  const getLightCategory = (lux: number) => {
    if (lux < 200) return { category: 'Low Light', icon: Moon, color: 'text-blue-600', bg: 'bg-blue-50' };
    if (lux < 800) return { category: 'Medium Light', icon: Cloud, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (lux < 2000) return { category: 'Bright Indirect', icon: Sun, color: 'text-green-600', bg: 'bg-green-50' };
    return { category: 'Direct Sun', icon: Sun, color: 'text-orange-600', bg: 'bg-orange-50' };
  };

  const takeMeasurement = () => {
    setIsReading(true);
    setTimeout(() => {
      setLightLevel(Math.floor(Math.random() * 2500 + 100));
      setIsReading(false);
    }, 2000);
  };

  const lightInfo = getLightCategory(lightLevel);
  const LightIcon = lightInfo.icon;

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Sun className="h-5 w-5" />
          Light Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg ${lightInfo.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium flex items-center gap-2">
              <LightIcon className="h-4 w-4" />
              Light Level
            </span>
            <Badge className={lightInfo.color}>{lightInfo.category}</Badge>
          </div>
          <div className="text-3xl font-bold mb-2">{lightLevel} lux</div>
          <Progress value={Math.min(lightLevel / 25, 100)} className="h-3" />
        </div>

        <Button 
          onClick={takeMeasurement}
          disabled={isReading}
          className="w-full bg-yellow-600 hover:bg-yellow-700"
        >
          {isReading ? (
            <>
              <Sun className="h-4 w-4 mr-2 animate-spin" />
              Measuring...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              Take Reading
            </>
          )}
        </Button>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Comparison
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(locations).map(([key, location]) => (
              <div 
                key={key}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  selectedLocation === key ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLocation(key)}
              >
                <div className="font-medium text-sm">{location.name}</div>
                <div className="text-xs text-gray-600">{location.ideal}</div>
                <div className="text-sm font-bold">{location.current} lux</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Plant Light Requirements</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Low Light Plants:</span>
              <span className="font-medium">50-250 lux</span>
            </div>
            <div className="flex justify-between">
              <span>Medium Light Plants:</span>
              <span className="font-medium">250-1000 lux</span>
            </div>
            <div className="flex justify-between">
              <span>Bright Light Plants:</span>
              <span className="font-medium">1000-2500 lux</span>
            </div>
            <div className="flex justify-between">
              <span>Full Sun Plants:</span>
              <span className="font-medium">2500+ lux</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 mb-1">💡 Light Tips</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• North windows provide consistent low light</li>
            <li>• South windows get the most direct sun</li>
            <li>• East/West windows get morning/evening sun</li>
            <li>• Use grow lights for dark areas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
