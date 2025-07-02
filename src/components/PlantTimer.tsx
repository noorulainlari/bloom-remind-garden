
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Play, Pause, RotateCcw, Bell } from 'lucide-react';

export const PlantTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timerType, setTimerType] = useState<'watering' | 'fertilizing' | 'pruning' | 'misting'>('watering');

  const durations = {
    watering: [5, 10, 15, 25],
    fertilizing: [10, 15, 30, 45],
    pruning: [15, 30, 45, 60],
    misting: [2, 5, 10, 15]
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play notification sound or show alert
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Plant Care Timer', {
          body: `Time for ${timerType}! 🌱`,
          icon: '/favicon.ico'
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, timerType]);

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setSelectedDuration(minutes);
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = selectedDuration > 0 
    ? ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100 
    : 0;

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Timer className="h-5 w-5" />
          Plant Care Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          {(['watering', 'fertilizing', 'pruning', 'misting'] as const).map(type => (
            <Button
              key={type}
              variant={timerType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimerType(type)}
              className="capitalize text-xs"
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="text-4xl font-mono font-bold text-green-700">
            {formatTime(timeLeft)}
          </div>
          
          {timeLeft > 0 && (
            <Progress value={progressPercentage} className="h-3" />
          )}

          <div className="grid grid-cols-4 gap-2">
            {durations[timerType].map(duration => (
              <Button
                key={duration}
                variant="outline"
                size="sm"
                onClick={() => startTimer(duration)}
                disabled={isActive && timeLeft > 0}
                className="text-xs"
              >
                {duration}m
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            {timeLeft > 0 && (
              <>
                <Button
                  onClick={isActive ? pauseTimer : () => setIsActive(true)}
                  variant={isActive ? 'secondary' : 'default'}
                  size="sm"
                >
                  {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button onClick={resetTimer} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Timer Tips</span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Watering: Use timer to avoid overwatering</li>
            <li>• Fertilizing: Time for even nutrient distribution</li>
            <li>• Pruning: Set focused work sessions</li>
            <li>• Misting: Regular intervals for humidity</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
