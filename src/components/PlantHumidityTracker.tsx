
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingUp, AlertTriangle, Wind } from 'lucide-react';

export const PlantHumidityTracker = () => {
  const [currentHumidity, setCurrentHumidity] = useState(45);
  const [targetHumidity, setTargetHumidity] = useState(60);
  const [isTracking, setIsTracking] = useState(false);
  const [humidityHistory, setHumidityHistory] = useState([
    { time: '12:00', humidity: 42 },
    { time: '13:00', humidity: 48 },
    { time: '14:00', humidity: 45 },
    { time: '15:00', humidity: 52 }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        const newHumidity = Math.max(20, Math.min(80, currentHumidity + (Math.random() - 0.5) * 6));
        setCurrentHumidity(Math.round(newHumidity));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isTracking, currentHumidity]);

  const getHumidityStatus = (humidity: number) => {
    if (humidity < 30) return { status: 'Too Low', color: 'text-red-600', bg: 'bg-red-50' };
    if (humidity > 70) return { status: 'Too High', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (humidity >= 50 && humidity <= 60) return { status: 'Optimal', color: 'text-green-600', bg: 'bg-green-50' };
    return { status: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  };

  const status = getHumidityStatus(currentHumidity);

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Droplets className="h-5 w-5" />
          Humidity Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg ${status.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Current Humidity</span>
            <Badge className={status.color}>{status.status}</Badge>
          </div>
          <div className="text-3xl font-bold mb-2">{currentHumidity}%</div>
          <Progress value={currentHumidity} className="h-3 mb-2" />
          <div className="text-sm text-gray-600">Target: {targetHumidity}%</div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsTracking(!isTracking)}
            variant={isTracking ? 'destructive' : 'default'}
            size="sm"
            className="flex-1"
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
          <Button variant="outline" size="sm">
            <Wind className="h-4 w-4 mr-2" />
            Humidifier
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recent Readings
          </h4>
          <div className="space-y-1">
            {humidityHistory.map((reading, index) => (
              <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span>{reading.time}</span>
                <span className="font-medium">{reading.humidity}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Humidity Tips</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Most houseplants prefer 40-60% humidity</li>
            <li>• Use pebble trays to increase local humidity</li>
            <li>• Group plants together for micro-climate</li>
            <li>• Avoid placing near heating vents</li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-red-50 rounded">
            <div className="font-medium text-red-600">Low</div>
            <div>&lt; 30%</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="font-medium text-green-600">Optimal</div>
            <div>50-60%</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="font-medium text-blue-600">High</div>
            <div>&gt; 70%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
