
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lightbulb, Droplets, Scissors } from 'lucide-react';

interface PlantCareGuideProps {
  plantName: string;
}

export const PlantCareGuide = ({ plantName }: PlantCareGuideProps) => {
  const careGuides = {
    'Snake Plant': {
      light: 'Low to bright indirect light',
      water: 'Water every 2-3 weeks',
      humidity: '30-50%',
      temperature: '65-80°F',
      tips: ['Allow soil to dry completely', 'Avoid overwatering', 'Wipe leaves monthly']
    },
    'Pothos': {
      light: 'Bright indirect light',
      water: 'Water when top inch of soil is dry',
      humidity: '40-60%',
      temperature: '65-85°F',
      tips: ['Prune regularly', 'Can grow in water', 'Rotate weekly for even growth']
    }
  };

  const guide = careGuides[plantName as keyof typeof careGuides] || careGuides['Snake Plant'];

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-5 w-5 text-indigo-600" />
        <span className="font-bold text-indigo-800">Care Guide</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-2 rounded border">
          <div className="text-xs text-gray-500">Light</div>
          <div className="text-sm font-medium">{guide.light}</div>
        </div>
        <div className="bg-white p-2 rounded border">
          <div className="text-xs text-gray-500">Water</div>
          <div className="text-sm font-medium">{guide.water}</div>
        </div>
        <div className="bg-white p-2 rounded border">
          <div className="text-xs text-gray-500">Humidity</div>
          <div className="text-sm font-medium">{guide.humidity}</div>
        </div>
        <div className="bg-white p-2 rounded border">
          <div className="text-xs text-gray-500">Temperature</div>
          <div className="text-sm font-medium">{guide.temperature}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Pro Tips</span>
        </div>
        {guide.tips.map((tip, index) => (
          <div key={index} className="text-sm text-gray-600 pl-6">• {tip}</div>
        ))}
      </div>
    </div>
  );
};
