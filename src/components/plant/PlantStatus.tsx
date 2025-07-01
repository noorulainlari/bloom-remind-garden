
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { format, parseISO, isToday, isPast, differenceInDays } from 'date-fns';

interface PlantStatusProps {
  nextWaterDate: string;
  wateringIntervalDays: number;
}

export const PlantStatus = ({ nextWaterDate, wateringIntervalDays }: PlantStatusProps) => {
  const getWaterStatus = () => {
    const date = parseISO(nextWaterDate);
    const today = new Date();
    const daysUntilWater = differenceInDays(date, today);
    
    if (isToday(date)) {
      return { 
        text: '💧 Water Today', 
        variant: 'default' as const, 
        urgent: true,
        progress: 100,
        status: 'due'
      };
    } else if (isPast(date)) {
      const daysOverdue = Math.abs(daysUntilWater);
      return { 
        text: `🚨 ${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue`, 
        variant: 'destructive' as const, 
        urgent: true,
        progress: 100,
        status: 'overdue'
      };
    } else {
      const progressPercent = Math.max(0, 100 - (daysUntilWater / wateringIntervalDays) * 100);
      let status = 'healthy';
      if (daysUntilWater <= 2) status = 'due-soon';
      
      return { 
        text: `💧 Water in ${daysUntilWater} day${daysUntilWater === 1 ? '' : 's'}`, 
        variant: 'secondary' as const, 
        urgent: false,
        progress: progressPercent,
        status
      };
    }
  };

  const waterStatus = getWaterStatus();
  const daysUntilWatering = Math.max(0, differenceInDays(parseISO(nextWaterDate), new Date()));

  const getProgressColor = () => {
    switch (waterStatus.status) {
      case 'overdue': return 'bg-gradient-to-r from-red-500 to-red-400';
      case 'due': return 'bg-gradient-to-r from-yellow-500 to-orange-400';
      case 'due-soon': return 'bg-gradient-to-r from-orange-500 to-yellow-400';
      default: return 'bg-gradient-to-r from-green-500 to-emerald-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Countdown Timer */}
      <div className="flex items-center gap-2 text-green-700 bg-green-100 rounded-lg p-3 border border-green-200">
        <Clock className="h-5 w-5 text-green-600" />
        <span className="text-base font-bold">
          {daysUntilWatering === 0 ? '⏰ Water Today!' : 
           daysUntilWatering === 1 ? '⏰ Water Tomorrow!' : 
           `⏰ ${daysUntilWatering} days until watering`}
        </span>
      </div>
      
      {/* Enhanced Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-green-700">Watering Progress</span>
          <Badge variant={waterStatus.variant} className="text-sm whitespace-nowrap px-4 py-2 rounded-full font-bold shadow-sm">
            {waterStatus.text}
          </Badge>
        </div>
        <div className="w-full bg-green-100 rounded-full h-4 overflow-hidden shadow-inner border-2 border-green-200">
          <div 
            className={`h-full transition-all duration-1000 ${getProgressColor()} shadow-sm animate-pulse`}
            style={{ width: `${Math.min(100, waterStatus.progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
