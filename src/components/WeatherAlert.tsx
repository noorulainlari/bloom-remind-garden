
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CloudRain, Sun, Snowflake, AlertTriangle } from 'lucide-react';

export const WeatherAlert = () => {
  const weather = {
    condition: 'rain',
    temperature: 18,
    alert: 'Heavy rain expected - move outdoor plants to shelter'
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'rain': return <CloudRain className="h-4 w-4 text-blue-500" />;
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'snow': return <Snowflake className="h-4 w-4 text-blue-300" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getWeatherIcon()}
          Weather Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {weather.alert}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
