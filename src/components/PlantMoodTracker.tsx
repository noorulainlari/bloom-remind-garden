
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Meh, Frown, TrendingUp } from 'lucide-react';

interface PlantMoodTrackerProps {
  plant: any;
}

export const PlantMoodTracker = ({ plant }: PlantMoodTrackerProps) => {
  const [currentMood, setCurrentMood] = useState('happy');
  const [moodHistory] = useState([
    { date: '2024-01-01', mood: 'happy' },
    { date: '2024-01-05', mood: 'neutral' },
    { date: '2024-01-10', mood: 'happy' }
  ]);

  const moodEmojis = {
    happy: { emoji: '😊', icon: Smile, color: 'text-green-500' },
    neutral: { emoji: '😐', icon: Meh, color: 'text-yellow-500' },
    sad: { emoji: '😢', icon: Frown, color: 'text-red-500' }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-5 w-5 text-purple-600" />
        <span className="font-bold text-purple-800">Plant Mood</span>
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        {Object.entries(moodEmojis).map(([mood, config]) => (
          <Button
            key={mood}
            variant={currentMood === mood ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentMood(mood)}
            className="flex flex-col items-center p-3 h-auto"
          >
            <span className="text-2xl">{config.emoji}</span>
            <span className="text-xs capitalize">{mood}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Recent Moods</div>
        <div className="flex gap-2 flex-wrap">
          {moodHistory.map((entry, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {moodEmojis[entry.mood as keyof typeof moodEmojis].emoji} {entry.date}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
