
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy } from 'lucide-react';

export const PlantCareStreak = () => {
  const streakDays = 7; // This would be calculated from watering history
  const longestStreak = 15;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Care Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Streak</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Flame className="h-3 w-3" />
              {streakDays} days
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Best Streak</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {longestStreak} days
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full" 
              style={{ width: `${(streakDays / longestStreak) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
