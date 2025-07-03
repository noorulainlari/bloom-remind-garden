
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Heart, TrendingUp, Calendar } from 'lucide-react';

interface PlantMoodTrackerProps {
  plant?: any;
}

export const PlantMoodTracker = ({ plant }: PlantMoodTrackerProps = {}) => {
  const [selectedPlant, setSelectedPlant] = useState('philodendron');
  
  const plants = {
    philodendron: {
      name: 'Philodendron Brasil',
      currentMood: 'happy',
      moodHistory: [
        { date: '2024-02-15', mood: 'happy', notes: 'New growth spotted!' },
        { date: '2024-02-10', mood: 'content', notes: 'Looking healthy' },
        { date: '2024-02-05', mood: 'stressed', notes: 'Leaves yellowing' },
        { date: '2024-02-01', mood: 'content', notes: 'Recovering well' }
      ],
      weeklyTrend: '+15%',
      stressFactors: ['Overwatering last week'],
      happinessFactors: ['New growth', 'Good light placement', 'Regular care routine']
    },
    'spider-plant': {
      name: 'Spider Plant',
      currentMood: 'thriving',
      moodHistory: [
        { date: '2024-02-15', mood: 'thriving', notes: 'Producing babies!' },
        { date: '2024-02-10', mood: 'happy', notes: 'Lush green foliage' },
        { date: '2024-02-05', mood: 'happy', notes: 'Growing fast' },
        { date: '2024-02-01', mood: 'content', notes: 'Stable growth' }
      ],
      weeklyTrend: '+25%',
      stressFactors: [],
      happinessFactors: ['Perfect watering schedule', 'Ideal light conditions', 'Producing plantlets']
    }
  };

  const moodEmojis = {
    thriving: { emoji: '🌟', icon: Heart, color: 'text-purple-600', bg: 'bg-purple-100' },
    happy: { emoji: '😊', icon: Smile, color: 'text-green-600', bg: 'bg-green-100' },
    content: { emoji: '😌', icon: Meh, color: 'text-blue-600', bg: 'bg-blue-100' },
    stressed: { emoji: '😰', icon: Frown, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    unhappy: { emoji: '😢', icon: Frown, color: 'text-red-600', bg: 'bg-red-100' }
  };

  const plantList = Object.keys(plants);
  const currentPlant = plants[selectedPlant];
  const currentMoodData = moodEmojis[currentPlant.currentMood];

  const handleMoodUpdate = (mood: string) => {
    console.log(`Updating ${currentPlant.name} mood to: ${mood}`);
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Smile className="h-5 w-5" />
          Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {plantList.map(plant => (
            <Button
              key={plant}
              variant={selectedPlant === plant ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPlant(plant)}
              className="capitalize"
            >
              {plants[plant].name.split(' ')[0]}
            </Button>
          ))}
        </div>

        <div className={`${currentMoodData.bg} p-4 rounded-lg`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{currentMoodData.emoji}</div>
              <div>
                <h3 className="font-semibold">{currentPlant.name}</h3>
                <p className={`text-sm font-medium capitalize ${currentMoodData.color}`}>
                  Feeling {currentPlant.currentMood}
                </p>
              </div>
            </div>
            <Badge className="bg-white text-gray-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              {currentPlant.weeklyTrend}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Update Mood</h4>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(moodEmojis).map(([mood, data]) => (
              <Button
                key={mood}
                variant="outline"
                size="sm"
                onClick={() => handleMoodUpdate(mood)}
                className={`flex flex-col items-center p-3 h-auto ${
                  currentPlant.currentMood === mood ? data.bg : ''
                }`}
              >
                <span className="text-lg mb-1">{data.emoji}</span>
                <span className="text-xs capitalize">{mood}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Mood History</h4>
          <div className="space-y-2">
            {currentPlant.moodHistory.slice(0, 3).map((entry, index) => (
              <div key={entry.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{moodEmojis[entry.mood].emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{entry.date}</span>
                    </div>
                    <p className="text-xs text-gray-500">{entry.notes}</p>
                  </div>
                </div>
                <Badge className={`${moodEmojis[entry.mood].bg} ${moodEmojis[entry.mood].color}`}>
                  {entry.mood}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {currentPlant.happinessFactors.length > 0 && (
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">What's Making Them Happy</span>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              {currentPlant.happinessFactors.map((factor, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentPlant.stressFactors.length > 0 && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Frown className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Stress Factors</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {currentPlant.stressFactors.map((factor, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full"></div>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">💡 Mood Insight</p>
          <p className="text-xs text-blue-700">
            {currentPlant.currentMood === 'thriving' 
              ? 'Your plant is absolutely loving their current conditions! Keep up the great work.'
              : currentPlant.currentMood === 'happy'
              ? 'Your plant is doing well. Continue the current care routine for optimal growth.'
              : 'Consider adjusting care routine based on stress factors to improve plant mood.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
