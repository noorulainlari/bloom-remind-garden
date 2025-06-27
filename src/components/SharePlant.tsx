
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SharePlantProps {
  plant: {
    id: string;
    plant_name: string;
    watering_interval_days: number;
    photo_url?: string;
  };
}

export const SharePlant = ({ plant }: SharePlantProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/shared-plant/${plant.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "🌱 Link Copied!",
        description: "Share this link with friends to show your plant.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-green-300 hover:bg-green-50">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-800 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your {plant.plant_name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            {plant.photo_url && (
              <img
                src={plant.photo_url}
                alt={plant.plant_name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 border-green-200"
              />
            )}
            <h3 className="font-semibold text-green-800">{plant.plant_name}</h3>
            <p className="text-sm text-green-600">Watered every {plant.watering_interval_days} day{plant.watering_interval_days === 1 ? '' : 's'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={shareUrl}
              className="flex-1 text-sm"
            />
            <Button onClick={copyToClipboard} size="sm" className="flex-shrink-0">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-green-600 text-center">
            Anyone with this link can view your plant's care schedule.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
