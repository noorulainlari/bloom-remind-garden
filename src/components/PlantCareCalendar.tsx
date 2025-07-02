
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlantCareCalendarProps {
  plants: any[];
}

export const PlantCareCalendar = ({ plants }: PlantCareCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getPlantCareForDate = (date: number) => {
    // Mock data - in real app, this would check actual care schedules
    const careEvents = [];
    if (date % 3 === 0) careEvents.push({ type: 'water', count: Math.floor(Math.random() * 3) + 1 });
    if (date % 7 === 0) careEvents.push({ type: 'fertilize', count: 1 });
    return careEvents;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Care Calendar
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{monthName}</span>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const careEvents = getPlantCareForDate(day);
            return (
              <div key={day} className="p-2 border rounded min-h-16">
                <div className="font-medium">{day}</div>
                <div className="space-y-1">
                  {careEvents.map((event, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {event.type === 'water' ? '💧' : '🌱'} {event.count}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
