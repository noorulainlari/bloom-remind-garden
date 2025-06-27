
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target, Heart } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface PlantAchievementsProps {
  plantCount: number;
  wateredCount: number;
  streakDays: number;
}

export const PlantAchievements = ({ plantCount, wateredCount, streakDays }: PlantAchievementsProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const achievementList: Achievement[] = [
      {
        id: 'first-plant',
        title: 'First Sprout',
        description: 'Add your first plant',
        icon: <Trophy className="h-5 w-5 text-yellow-500" />,
        unlocked: plantCount >= 1,
      },
      {
        id: 'plant-collector',
        title: 'Plant Collector',
        description: 'Add 5 plants to your garden',
        icon: <Target className="h-5 w-5 text-green-500" />,
        unlocked: plantCount >= 5,
        progress: plantCount,
        maxProgress: 5,
      },
      {
        id: 'water-master',
        title: 'Water Master',
        description: 'Water plants 10 times',
        icon: <Zap className="h-5 w-5 text-blue-500" />,
        unlocked: wateredCount >= 10,
        progress: wateredCount,
        maxProgress: 10,
      },
      {
        id: 'dedicated-gardener',
        title: 'Dedicated Gardener',
        description: 'Maintain a 7-day watering streak',
        icon: <Heart className="h-5 w-5 text-red-500" />,
        unlocked: streakDays >= 7,
        progress: streakDays,
        maxProgress: 7,
      },
    ];

    setAchievements(achievementList);
  }, [plantCount, wateredCount, streakDays]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  if (unlockedAchievements.length === 0) {
    return null;
  }

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-lg text-green-800 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {unlockedAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              {achievement.icon}
              <div className="flex-1">
                <h4 className="font-medium text-green-800 text-sm">{achievement.title}</h4>
                <p className="text-xs text-green-600">{achievement.description}</p>
                {achievement.progress && achievement.maxProgress && (
                  <div className="mt-1">
                    <div className="w-full bg-green-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-green-500 mt-1">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                ✨
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
