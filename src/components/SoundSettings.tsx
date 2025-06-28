
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type SoundType = 'rainfall' | 'wind' | 'birds' | 'garden' | 'chimes' | 'water' | 'thunder' | 'forest' | 'droplets' | 'silent';

interface SoundOption {
  id: SoundType;
  name: string;
  emoji: string;
  description: string;
  frequency: number;
  type: OscillatorType;
  modulation?: number;
}

const SOUND_OPTIONS: SoundOption[] = [
  {
    id: 'rainfall',
    name: 'Soft Rainfall',
    emoji: '🌧️',
    description: 'Gentle rain sounds for peaceful ambience',
    frequency: 150,
    type: 'square'
  },
  {
    id: 'wind',
    name: 'Gentle Wind through Leaves',
    emoji: '🍃',
    description: 'Soft rustling of leaves in the breeze',
    frequency: 200,
    type: 'sawtooth',
    modulation: 0.3
  },
  {
    id: 'birds',
    name: 'Birds Chirping (Koyal-style)',
    emoji: '🐦',
    description: 'Sweet melodic bird songs',
    frequency: 800,
    type: 'sine',
    modulation: 0.8
  },
  {
    id: 'garden',
    name: 'Garden Ambience with Insects',
    emoji: '🦗',
    description: 'Natural garden sounds with crickets',
    frequency: 400,
    type: 'triangle',
    modulation: 0.5
  },
  {
    id: 'chimes',
    name: 'Bamboo Chimes',
    emoji: '🎐',
    description: 'Peaceful wind chimes swaying gently',
    frequency: 600,
    type: 'sine',
    modulation: 0.2
  },
  {
    id: 'water',
    name: 'Stream/River Water Flow',
    emoji: '🏞️',
    description: 'Flowing water over stones',
    frequency: 120,
    type: 'square',
    modulation: 0.4
  },
  {
    id: 'thunder',
    name: 'Distant Thunderstorm',
    emoji: '⛈️',
    description: 'Soft rumbling thunder in the distance',
    frequency: 80,
    type: 'sawtooth',
    modulation: 0.1
  },
  {
    id: 'forest',
    name: 'Forest Morning Ambience',
    emoji: '🌲',
    description: 'Early morning forest sounds',
    frequency: 300,
    type: 'triangle',
    modulation: 0.6
  },
  {
    id: 'droplets',
    name: 'Water Droplets / Mist',
    emoji: '💧',
    description: 'Gentle water droplets and misting',
    frequency: 180,
    type: 'sine',
    modulation: 0.9
  },
  {
    id: 'silent',
    name: 'No Sound (Silent Mode)',
    emoji: '🔇',
    description: 'Complete silence for focused work',
    frequency: 0,
    type: 'sine'
  }
];

export const SoundSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSounds, setActiveSounds] = useState<Set<SoundType>>(new Set());
  const [volume, setVolume] = useState(30);
  const audioContextsRef = useRef<Map<SoundType, {
    context: AudioContext;
    oscillator: OscillatorNode;
    gainNode: GainNode;
    lfo?: OscillatorNode;
  }>>(new Map());

  // Load preferences from localStorage
  useEffect(() => {
    const savedSounds = localStorage.getItem('garden-active-sounds');
    const savedVolume = localStorage.getItem('garden-sound-volume');
    
    if (savedSounds) {
      try {
        const parsed = JSON.parse(savedSounds);
        setActiveSounds(new Set(parsed));
      } catch (error) {
        console.warn('Failed to parse saved sounds:', error);
      }
    }
    
    if (savedVolume) {
      setVolume(parseInt(savedVolume, 10));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('garden-active-sounds', JSON.stringify(Array.from(activeSounds)));
    localStorage.setItem('garden-sound-volume', volume.toString());
  }, [activeSounds, volume]);

  const createAmbientSound = (soundOption: SoundOption) => {
    if (soundOption.id === 'silent' || soundOption.frequency === 0) return null;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = soundOption.type;
      oscillator.frequency.setValueAtTime(soundOption.frequency, audioContext.currentTime);
      
      // Set volume based on slider
      const normalizedVolume = (volume / 100) * 0.15; // Keep sounds gentle
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(normalizedVolume, audioContext.currentTime + 0.5);
      
      // Add modulation if specified
      let lfo;
      if (soundOption.modulation) {
        lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        lfo.frequency.setValueAtTime(soundOption.modulation, audioContext.currentTime);
        lfoGain.gain.setValueAtTime(soundOption.frequency * 0.1, audioContext.currentTime);
        lfo.start();
      }
      
      oscillator.start();

      return { context: audioContext, oscillator, gainNode, lfo };
    } catch (error) {
      console.warn('Audio context not supported for sound:', soundOption.name);
      return null;
    }
  };

  const toggleSound = (soundId: SoundType) => {
    const newActiveSounds = new Set(activeSounds);
    
    if (soundId === 'silent') {
      // Silent mode - stop all sounds
      stopAllSounds();
      newActiveSounds.clear();
      newActiveSounds.add('silent');
    } else {
      if (activeSounds.has(soundId)) {
        // Stop this sound
        stopSound(soundId);
        newActiveSounds.delete(soundId);
        newActiveSounds.delete('silent');
      } else {
        // Start this sound
        newActiveSounds.delete('silent');
        const soundOption = SOUND_OPTIONS.find(s => s.id === soundId);
        if (soundOption) {
          const audioElements = createAmbientSound(soundOption);
          if (audioElements) {
            audioContextsRef.current.set(soundId, audioElements);
            newActiveSounds.add(soundId);
          }
        }
      }
    }
    
    setActiveSounds(newActiveSounds);
  };

  const stopSound = (soundId: SoundType) => {
    const audioElements = audioContextsRef.current.get(soundId);
    if (audioElements) {
      try {
        audioElements.oscillator.stop();
        if (audioElements.lfo) audioElements.lfo.stop();
        audioElements.context.close();
      } catch (error) {
        console.warn('Error stopping sound:', error);
      }
      audioContextsRef.current.delete(soundId);
    }
  };

  const stopAllSounds = () => {
    audioContextsRef.current.forEach((_, soundId) => {
      stopSound(soundId);
    });
    audioContextsRef.current.clear();
  };

  const updateVolume = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    
    // Update volume for all active sounds
    const normalizedVolume = (vol / 100) * 0.15;
    audioContextsRef.current.forEach((audioElements) => {
      if (audioElements.gainNode && audioElements.context) {
        audioElements.gainNode.gain.linearRampToValueAtTime(
          normalizedVolume, 
          audioElements.context.currentTime + 0.1
        );
      }
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, []);

  const activeSoundCount = activeSounds.has('silent') ? 0 : activeSounds.size;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 garden-button shadow-lg"
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
          {/* Volume Control */}
          <Card className="border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                🔊 Master Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <VolumeX className="h-5 w-5 text-gray-500" />
                  <Slider
                    value={[volume]}
                    onValueChange={updateVolume}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <Volume2 className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-sm text-green-600 text-center font-semibold">
                  Volume: {volume}% | Active Sounds: {activeSoundCount}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sound Options */}
          <Card className="border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-green-700">
                🌿 Ambient Sound Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {SOUND_OPTIONS.map((sound) => (
                  <div
                    key={sound.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      activeSounds.has(sound.id)
                        ? 'border-green-400 bg-green-50 shadow-lg'
                        : 'border-green-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{sound.emoji}</div>
                      <div>
                        <h4 className="font-bold text-green-800">{sound.name}</h4>
                        <p className="text-sm text-green-600">{sound.description}</p>
                      </div>
                    </div>
                    
                    <Switch
                      checked={activeSounds.has(sound.id)}
                      onCheckedChange={() => toggleSound(sound.id)}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Tips */}
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
