
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Award, Medal, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface PlantAchievementsProps {
  plants: any[];
}

export const PlantAchievements = ({ plants }: PlantAchievementsProps) => {
  const achievements: Achievement[] = [
    {
      id: 'first_plant',
      title: 'Green Thumb Beginner',
      description: 'Add your first plant',
      icon: Star,
      unlocked: plants.length >= 1,
      progress: Math.min(plants.length, 1),
      maxProgress: 1,
      rarity: 'common'
    },
    {
      id: 'plant_collector',
      title: 'Plant Collector',
      description: 'Own 5 plants',
      icon: Trophy,
      unlocked: plants.length >= 5,
      progress: Math.min(plants.length, 5),
      maxProgress: 5,
      rarity: 'rare'
    },
    {
      id: 'plant_master',
      title: 'Plant Master',
      description: 'Own 10 plants',
      icon: Crown,
      unlocked: plants.length >= 10,
      progress: Math.min(plants.length, 10),
      maxProgress: 10,
      rarity: 'epic'
    },
    {
      id: 'consistent_carer',
      title: 'Consistent Carer',
      description: 'Water plants 30 times',
      icon: Target,
      unlocked: false,
      progress: Math.floor(Math.random() * 25) + 5,
      maxProgress: 30,
      rarity: 'rare'
    },
    {
      id: 'plant_whisperer',
      title: 'Plant Whisperer',
      description: 'Keep all plants healthy for 30 days',
      icon: Award,
      unlocked: false,
      progress: Math.floor(Math.random() * 20) + 5,
      maxProgress: 30,
      rarity: 'epic'
    },
    {
      id: 'garden_legend',
      title: 'Garden Legend',
      description: 'Achieve perfect care score',
      icon: Medal,
      unlocked: false,
      progress: Math.floor(Math.random() * 80) + 10,
      maxProgress: 100,
      rarity: 'legendary'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Trophy className="h-5 w-5" />
          Plant Achievements
        </CardTitle>
        <div className="flex items-center gap-2">
          <Progress value={(unlockedCount / achievements.length) * 100} className="flex-1" />
          <span className="text-sm text-gray-600">{unlockedCount}/{achievements.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                achievement.unlocked 
                  ? 'bg-green-50 border-green-200 shadow-md' 
                  : 'bg-gray-50 border-gray-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <achievement.icon 
                    className={`h-5 w-5 ${
                      achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                    }`} 
                  />
                  <div>
                    <h4 className={`font-medium ${
                      achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                <Badge className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
              </div>
              
              {!achievement.unlocked && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {achievement.unlocked && (
                <div className="mt-2 flex items-center gap-1 text-green-600">
                  <Trophy className="h-3 w-3" />
                  <span className="text-xs font-medium">Unlocked!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
