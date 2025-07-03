
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const PlantGrowthChart = () => {
  const growthData = [
    { month: 'Jan', height: 15 },
    { month: 'Feb', height: 18 },
    { month: 'Mar', height: 22 },
    { month: 'Apr', height: 25 },
    { month: 'May', height: 28 }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Growth Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Line 
                type="monotone" 
                dataKey="height" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-gray-600">Plant height in cm</span>
        </div>
      </CardContent>
    </Card>
  );
};
