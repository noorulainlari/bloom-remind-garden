
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, AlertCircle } from 'lucide-react';

interface PlantHealthScoreProps {
  plant?: any;
}

export const PlantHealthScore = ({ plant }: PlantHealthScoreProps) => {
  const healthScore = 85; // This would be calculated based on various factors
  const factors = [
    { name: 'Watering', score: 90, status: 'good' },
    { name: 'Light', score: 80, status: 'good' },
    { name: 'Growth', score: 85, status: 'good' },
    { name: 'Care Frequency', score: 85, status: 'warning' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Health Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
              {healthScore}%
            </div>
            <Badge variant={healthScore >= 80 ? 'default' : 'secondary'}>
              {healthScore >= 80 ? 'Healthy' : 'Needs Attention'}
            </Badge>
          </div>
          <Progress value={healthScore} className="w-full" />
          <div className="space-y-2">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{factor.name}</span>
                <div className="flex items-center gap-2">
                  <span className={getScoreColor(factor.score)}>{factor.score}%</span>
                  {factor.status === 'warning' && (
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
