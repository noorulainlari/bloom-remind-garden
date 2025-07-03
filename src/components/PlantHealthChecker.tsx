
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface PlantHealthCheckerProps {
  plant: any;
}

export const PlantHealthChecker = ({ plant }: PlantHealthCheckerProps) => {
  const [healthCheck, setHealthCheck] = useState<any>(null);

  const performHealthCheck = () => {
    const checks = [
      { name: 'Watering Schedule', status: 'good', message: 'On track' },
      { name: 'Light Exposure', status: 'warning', message: 'Could use more light' },
      { name: 'Soil Condition', status: 'good', message: 'Well draining' },
      { name: 'Temperature', status: 'good', message: 'Ideal range' }
    ];
    
    setHealthCheck({
      overall: 'good',
      score: 85,
      checks: checks
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'bad': return <X className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          <span className="font-bold text-pink-800">Health Check</span>
        </div>
        <Button onClick={performHealthCheck} size="sm" variant="outline">
          Analyze
        </Button>
      </div>
      
      {healthCheck && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-pink-700">{healthCheck.score}%</span>
            <Badge variant={healthCheck.overall === 'good' ? 'default' : 'destructive'}>
              {healthCheck.overall === 'good' ? 'Healthy' : 'Needs Attention'}
            </Badge>
          </div>
          <div className="space-y-2">
            {healthCheck.checks.map((check: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  <span>{check.name}</span>
                </div>
                <span className="text-gray-600">{check.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
