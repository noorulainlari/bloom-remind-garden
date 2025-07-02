
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, Gauge } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  condition: string;
  pressure: number;
  visibility: number;
}

export const PlantWeather = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    humidity: 65,
    uvIndex: 6,
    windSpeed: 8,
    condition: 'partly-cloudy',
    pressure: 1013,
    visibility: 10
  });

  const [showDetails, setShowDetails] = useState(false);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getPlantAdvice = () => {
    const advice = [];
    
    if (weather.temperature > 30) {
      advice.push('🌡️ High temperature: Increase watering frequency');
    }
    if (weather.humidity < 40) {
      advice.push('💧 Low humidity: Consider misting your plants');
    }
    if (weather.uvIndex > 7) {
      advice.push('☀️ High UV: Move sensitive plants to shade');
    }
    if (weather.condition === 'rainy') {
      advice.push('🌧️ Rainy weather: Reduce watering for outdoor plants');
    }

    return advice.length > 0 ? advice : ['🌱 Perfect conditions for your plants today!'];
  };

  const getUVLevel = (index: number) => {
    if (index <= 2) return { level: 'Low', color: 'bg-green-100 text-green-800' };
    if (index <= 5) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    if (index <= 7) return { level: 'High', color: 'bg-orange-100 text-orange-800' };
    return { level: 'Very High', color: 'bg-red-100 text-red-800' };
  };

  const uvLevel = getUVLevel(weather.uvIndex);

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Cloud className="h-5 w-5" />
          Plant Weather Station
        </CardTitle>
        <Button 
          onClick={() => setShowDetails(!showDetails)} 
          variant="ghost" 
          size="sm"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Thermometer className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-blue-700">{weather.temperature}°C</div>
            <div className="text-xs text-blue-600">Temperature</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Droplets className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-green-700">{weather.humidity}%</div>
            <div className="text-xs text-green-600">Humidity</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Sun className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-orange-700">{weather.uvIndex}</div>
            <div className="text-xs text-orange-600">UV Index</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Wind className="h-5 w-5 text-gray-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-gray-700">{weather.windSpeed}</div>
            <div className="text-xs text-gray-600">Wind (km/h)</div>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <Gauge className="h-4 w-4 text-gray-600" />
              <div>
                <div className="text-sm font-medium">{weather.pressure} hPa</div>
                <div className="text-xs text-gray-500">Pressure</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <Eye className="h-4 w-4 text-gray-600" />
              <div>
                <div className="text-sm font-medium">{weather.visibility} km</div>
                <div className="text-xs text-gray-500">Visibility</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          {getWeatherIcon(weather.condition)}
          <div className="flex-1 ml-3">
            <div className="font-medium text-gray-800 capitalize">{weather.condition.replace('-', ' ')}</div>
            <Badge className={uvLevel.color}>{uvLevel.level} UV</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-green-800">Plant Care Recommendations</h4>
          <div className="space-y-1">
            {getPlantAdvice().map((tip, index) => (
              <div key={index} className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-300">
                {tip}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-yellow-50 rounded">
            <div className="text-xs text-yellow-600">Morning</div>
            <div className="font-medium">{weather.temperature - 5}°C</div>
          </div>
          <div className="p-2 bg-orange-50 rounded">
            <div className="text-xs text-orange-600">Afternoon</div>
            <div className="font-medium">{weather.temperature + 3}°C</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-xs text-blue-600">Evening</div>
            <div className="font-medium">{weather.temperature - 2}°C</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
