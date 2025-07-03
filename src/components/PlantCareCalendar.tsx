
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplets, Scissors, Sun } from 'lucide-react';

interface PlantCareCalendarProps {
  plants?: any[];
}

export const PlantCareCalendar = ({ plants }: PlantCareCalendarProps) => {
  const today = new Date();
  const weekDays = [];
  
  // Generate next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    weekDays.push({
      date: date.getDate(),
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      tasks: i === 0 ? ['Water Monstera', 'Rotate Pothos'] : 
             i === 2 ? ['Fertilize Snake Plant'] : 
             i === 4 ? ['Prune Fiddle Leaf'] : []
    });
  }

  const getTaskIcon = (task: string) => {
    if (task.includes('Water')) return <Droplets className="h-3 w-3 text-blue-500" />;
    if (task.includes('Prune')) return <Scissors className="h-3 w-3 text-purple-500" />;
    if (task.includes('Rotate')) return <Sun className="h-3 w-3 text-yellow-500" />;
    return <Calendar className="h-3 w-3 text-green-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-500" />
          This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {day.day}
              </div>
              <div className={`text-sm font-bold mb-2 w-6 h-6 flex items-center justify-center rounded-full mx-auto ${
                index === 0 ? 'bg-green-500 text-white' : 'text-gray-700'
              }`}>
                {day.date}
              </div>
              <div className="space-y-1">
                {day.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center justify-center">
                    {getTaskIcon(task)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
