
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlantSelector } from './PlantSelector';

interface FloatingActionButtonProps {
  onPlantAdded?: () => void;
}

export const FloatingActionButton = ({ onPlantAdded }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePlantAdded = () => {
    if (onPlantAdded) {
      onPlantAdded();
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl garden-button hover:scale-110 transition-all duration-300"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800 flex items-center gap-3">
            🌱 Add New Plant
          </DialogTitle>
        </DialogHeader>
        
        <PlantSelector onPlantAdded={handlePlantAdded} />
      </DialogContent>
    </Dialog>
  );
};
