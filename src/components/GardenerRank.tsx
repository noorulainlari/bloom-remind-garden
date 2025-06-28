
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface GardenerRankProps {
  refreshTrigger: number;
}

const GARDENER_RANKS = [
  { min: 0, max: 2, title: 'Seedling Gardener', icon: '🌱', color: 'bg-green-100 text-green-800' },
  { min: 3, max: 5, title: 'Growing Gardener', icon: '🌿', color: 'bg-green-200 text-green-800' },
  { min: 6, max: 10, title: 'Plant Parent', icon: '🪴', color: 'bg-green-300 text-green-900' },
  { min: 11, max: 20, title: 'Garden Master', icon: '🌳', color: 'bg-emerald-200 text-emerald-900' },
  { min: 21, max: 50, title: 'Plant Whisperer', icon: '🌺', color: 'bg-emerald-300 text-emerald-900' },
  { min: 51, max: Infinity, title: 'Botanical Expert', icon: '🏆', color: 'bg-yellow-200 text-yellow-900' }
];

export const GardenerRank = ({ refreshTrigger }: GardenerRankProps) => {
  const [plantCount, setPlantCount] = useState(0);
  const [totalWaterings, setTotalWaterings] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      // Get plant count
      const { data: plants } = await supabase
        .from('user_plants')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Get total watering logs
      const { data: logs } = await supabase
        .from('watering_logs')
        .select('id, plant_id')
        .in('plant_id', (plants || []).map(p => p.id));

      setPlantCount(plants?.length || 0);
      setTotalWaterings(logs?.length || 0);
    };

    loadStats();
  }, [user, refreshTrigger]);

  const getCurrentRank = () => {
    return GARDENER_RANKS.find(rank => 
      plantCount >= rank.min && plantCount <= rank.max
    ) || GARDENER_RANKS[0];
  };

  const getNextRank = () => {
    const currentRank = getCurrentRank();
    const currentIndex = GARDENER_RANKS.indexOf(currentRank);
    return GARDENER_RANKS[currentIndex + 1] || null;
  };

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();

  if (!user) return null;

  return (
    <Card className="plant-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Your Gardener Rank
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{currentRank.icon}</div>
          <Badge className={`text-lg px-4 py-2 ${currentRank.color}`}>
            {currentRank.title}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">Plants</span>
            </div>
            <div className="text-2xl font-bold text-green-800">{plantCount}</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Waterings</span>
            </div>
            <div className="text-2xl font-bold text-blue-800">{totalWaterings}</div>
          </div>
        </div>

        {nextRank && (
          <div className="text-center text-sm text-green-600">
            <p>
              Next rank: <span className="font-semibold">{nextRank.title}</span>
            </p>
            <p>
              Need {nextRank.min - plantCount} more plants to advance!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
