
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Droplets } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

interface WateringCalendarProps {
  plants: Array<{
    id: string;
    plant_name: string;
    next_water_date: string;
    last_watered: string;
  }>;
}

export const WateringCalendar = ({ plants }: WateringCalendarProps) => {
  const [currentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPlantsDueOnDate = (date: Date) => {
    return plants.filter(plant => {
      const nextWaterDate = parseISO(plant.next_water_date);
      return isSameDay(nextWaterDate, date);
    });
  };

  const getPlantsWateredOnDate = (date: Date) => {
    return plants.filter(plant => {
      const lastWateredDate = parseISO(plant.last_watered);
      return isSameDay(lastWateredDate, date);
    });
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-lg text-green-800 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Watering Calendar - {format(currentMonth, 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-green-700 mb-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day, index) => {
            const plantsDue = getPlantsDueOnDate(day);
            const plantsWatered = getPlantsWateredOnDate(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={index}
                className={`
                  aspect-square p-1 text-xs border rounded-lg relative
                  ${isToday ? 'bg-green-200 border-green-400' : 'border-green-100'}
                  ${plantsDue.length > 0 ? 'bg-orange-100 border-orange-300' : ''}
                  ${plantsWatered.length > 0 ? 'bg-blue-100 border-blue-300' : ''}
                `}
              >
                <div className="font-medium text-green-800">
                  {format(day, 'd')}
                </div>
                {plantsDue.length > 0 && (
                  <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {plantsDue.length}
                  </div>
                )}
                {plantsWatered.length > 0 && (
                  <Droplets className="absolute bottom-0 left-0 h-3 w-3 text-blue-500" />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-xs text-green-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Plants due for watering</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-3 w-3 text-blue-500" />
            <span>Plants watered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
