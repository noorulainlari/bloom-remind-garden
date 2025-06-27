
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const BackgroundSounds = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('birds');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio contexts for different sounds
  const sounds = {
    birds: {
      name: '🐦 Birds Chirping',
      // Using a simple oscillator-based bird sound
      frequency: 800,
      type: 'sine' as OscillatorType
    },
    wind: {
      name: '🍃 Gentle Wind',
      frequency: 200,
      type: 'sawtooth' as OscillatorType
    },
    rain: {
      name: '🌧️ Light Rain',
      frequency: 100,
      type: 'square' as OscillatorType
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const createAmbientSound = (frequency: number, type: OscillatorType) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      // Create a gentle, varying volume
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.5);
      
      // Add slight frequency modulation for natural sound
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      lfo.frequency.setValueAtTime(0.5, audioContext.currentTime);
      lfoGain.gain.setValueAtTime(10, audioContext.currentTime);
      
      oscillator.start();
      lfo.start();

      return { oscillator, lfo, audioContext, gainNode };
    } catch (error) {
      console.warn('Audio context not supported');
      return null;
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } else {
      const sound = sounds[currentSound as keyof typeof sounds];
      const audioElements = createAmbientSound(sound.frequency, sound.type);
      
      if (audioElements) {
        setIsPlaying(true);
        audioRef.current = audioElements as any;
      }
    }
  };

  return (
    <Card className="plant-card border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleSound}
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              className={isPlaying ? "garden-button" : "border-green-300 hover:bg-green-100"}
            >
              {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <div>
              <p className="text-sm font-medium text-green-800">Ambient Sounds</p>
              <p className="text-xs text-green-600">
                {isPlaying ? `Playing: ${sounds[currentSound as keyof typeof sounds].name}` : 'Relaxing garden sounds'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {Object.entries(sounds).map(([key, sound]) => (
              <Button
                key={key}
                onClick={() => setCurrentSound(key)}
                variant={currentSound === key ? "default" : "ghost"}
                size="sm"
                className={`text-xs px-2 py-1 ${
                  currentSound === key 
                    ? "garden-button" 
                    : "text-green-700 hover:bg-green-100"
                }`}
              >
                {sound.name.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
