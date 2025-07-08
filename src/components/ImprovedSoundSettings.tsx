import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, Settings, Play, Pause, Loader2, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useImprovedSoundManager, IMPROVED_SOUND_OPTIONS, SoundType } from './sound/ImprovedSoundManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ImprovedSoundSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    activeSound,
    volume,
    isPlaying,
    isLoading,
    playSound,
    stopSound,
    toggleSound,
    updateVolume,
    isMobile
  } = useImprovedSoundManager();

  const handleSoundSelect = async (soundId: SoundType) => {
    if (soundId === activeSound && isPlaying) {
      await stopSound();
    } else {
      await playSound(soundId);
    }
  };

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
          {isLoading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : isPlaying ? (
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
            🎵 Ambient Sound Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Mobile Notice */}
          {isMobile && (
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                On mobile devices, you'll need to tap a sound to start playback due to browser restrictions.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Toggle */}
          <Card className="border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                🎛️ Quick Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  onClick={toggleSound}
                  disabled={isLoading}
                  className="garden-button"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <VolumeX className="h-4 w-4" />
                    <Slider
                      value={[volume]}
                      onValueChange={updateVolume}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    Volume: {volume}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sound Library */}
          <Card className="border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-green-700">
                🌿 Nature Sound Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {IMPROVED_SOUND_OPTIONS.map((sound) => (
                  <div
                    key={sound.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      activeSound === sound.id && isPlaying
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                    }`}
                    onClick={() => handleSoundSelect(sound.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sound.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-green-800">
                            {sound.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {sound.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLoading && activeSound === sound.id && (
                          <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                        )}
                        {activeSound === sound.id && isPlaying && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                            <div className="w-1 h-3 bg-green-500 animate-pulse delay-100"></div>
                            <div className="w-1 h-5 bg-green-500 animate-pulse delay-200"></div>
                          </div>
                        )}
                        <Button
                          variant={activeSound === sound.id && isPlaying ? "secondary" : "outline"}
                          size="sm"
                          disabled={isLoading}
                        >
                          {activeSound === sound.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-800 mb-2">🎧 Sound Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use headphones for the best immersive experience</li>
              <li>• Lower volume (20-40%) works best for background ambience</li>
              <li>• Sounds continue playing while you navigate the app</li>
              <li>• Your preferences are automatically saved</li>
              {isMobile && (
                <li>• On mobile: tap a sound button to start playback</li>
              )}
            </ul>
          </div>

          {/* Current Status */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              Currently Playing: <span className="font-semibold">
                {isPlaying ? 
                  IMPROVED_SOUND_OPTIONS.find(s => s.id === activeSound)?.name || 'Unknown' 
                  : 'Silent'
                }
              </span>
            </div>
            {isPlaying && (
              <div className="text-xs text-gray-500 mt-1">
                Volume: {volume}% • {isMobile ? 'Mobile Mode' : 'Desktop Mode'}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};