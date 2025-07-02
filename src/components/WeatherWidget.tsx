
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

export const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    recommendation: 'Perfect day for watering your plants!'
  });

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          🌤️ Weather & Care Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          {getWeatherIcon()}
          <div>
            <div className="text-2xl font-bold">{weather.temperature}°C</div>
            <div className="text-sm text-gray-600 capitalize">{weather.condition}</div>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1 text-sm">
              <Thermometer className="h-4 w-4" />
              {weather.humidity}% humidity
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-700 font-medium">{weather.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
};
