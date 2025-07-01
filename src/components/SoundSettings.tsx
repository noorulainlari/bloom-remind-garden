
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SoundOption } from './sound/SoundOption';
import { VolumeControl } from './sound/VolumeControl';
import { useSoundManager, SOUND_OPTIONS } from './sound/useSoundManager';

export const SoundSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSounds, volume, toggleSound, updateVolume, activeSoundCount } = useSoundManager();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          data-tour="sound-settings"
          variant="outline"
          size="sm"
          className="fixed bottom-20 right-4 z-40 garden-button shadow-lg lg:bottom-4"
          title="Sound Settings"
        >
          {activeSoundCount > 0 ? (
            <Volume2 className="h-5 w-5 mr-2" />
          ) : (
            <VolumeX className="h-5 w-5 mr-2" />
          )}
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800 flex items-center gap-3">
            🎵 Sound Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                🔊 Master Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VolumeControl
                volume={volume}
                activeSoundCount={activeSoundCount}
                onVolumeChange={updateVolume}
              />
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-green-700">
                🌿 Ambient Sound Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {SOUND_OPTIONS.map((sound) => (
                  <SoundOption
                    key={sound.id}
                    sound={sound}
                    isActive={activeSounds.has(sound.id as any)}
                    onToggle={toggleSound}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Sound Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Mix multiple sounds for a rich ambience</li>
              <li>• Lower volume (10-30%) works best for background</li>
              <li>• Silent mode stops all sounds instantly</li>
              <li>• Your preferences are automatically saved</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
