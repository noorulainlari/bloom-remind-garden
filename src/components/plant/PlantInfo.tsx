
import { Calendar, Droplets, Heart } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PlantInfoProps {
  lastWatered?: string;
  nextWaterDate: string;
  wateringIntervalDays: number;
}

export const PlantInfo = ({ lastWatered, nextWaterDate, wateringIntervalDays }: PlantInfoProps) => {
  return (
    <div className="space-y-4 text-base">
      <div className="flex items-center gap-3 text-green-700 p-3 bg-green-50 rounded-xl border border-green-200">
        <Calendar className="h-5 w-5 flex-shrink-0" />
        <span className="truncate font-bold">Last: {lastWatered ? format(parseISO(lastWatered), 'MMM dd, yyyy') : 'Never'}</span>
      </div>
      
      <div className="flex items-center gap-3 text-blue-600 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <Droplets className="h-5 w-5 flex-shrink-0" />
        <span className="truncate font-bold">Next: {format(parseISO(nextWaterDate), 'MMM dd, yyyy')}</span>
      </div>
      
      <div className="text-green-600 font-bold flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
        <Heart className="h-5 w-5 text-red-500 animate-pulse" />
        <span className="text-base">Every {wateringIntervalDays} day{wateringIntervalDays === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
};
