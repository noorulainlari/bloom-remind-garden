
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, Square } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type PlayState = 'stopped' | 'playing' | 'paused';

export const BackgroundSounds = () => {
  const [playState, setPlayState] = useState<PlayState>('stopped');
  const [currentSound, setCurrentSound] = useState('birds');
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Create audio contexts for different sounds
  const sounds = {
    birds: {
      name: '🐦 Birds Chirping',
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

  // Load preferences from localStorage
  useEffect(() => {
    const savedSound = localStorage.getItem('garden-sound-preference');
    const savedPlayState = localStorage.getItem('garden-sound-play-state');
    
    if (savedSound && sounds[savedSound as keyof typeof sounds]) {
      setCurrentSound(savedSound);
    }
    
    // Don't auto-start sound on refresh - user must explicitly play
    if (savedPlayState === 'playing') {
      setPlayState('paused'); // Start paused instead of playing
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('garden-sound-preference', currentSound);
    localStorage.setItem('garden-sound-play-state', playState);
  }, [currentSound, playState]);

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
      gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.5);
      
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

  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (lfoRef.current) {
      lfoRef.current.stop();
      lfoRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    gainRef.current = null;
    setPlayState('stopped');
  };

  const playSound = () => {
    if (playState === 'paused' && audioContextRef.current && gainRef.current) {
      // Resume from pause
      audioContextRef.current.resume();
      gainRef.current.gain.linearRampToValueAtTime(0.08, audioContextRef.current.currentTime + 0.5);
      setPlayState('playing');
    } else {
      // Start new sound
      stopSound(); // Stop any existing sound
      
      const sound = sounds[currentSound as keyof typeof sounds];
      const audioElements = createAmbientSound(sound.frequency, sound.type);
      
      if (audioElements) {
        audioContextRef.current = audioElements.audioContext;
        oscillatorRef.current = audioElements.oscillator;
        gainRef.current = audioElements.gainNode;
        lfoRef.current = audioElements.lfo;
        setPlayState('playing');
      }
    }
  };

  const pauseSound = () => {
    if (audioContextRef.current && gainRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);
      audioContextRef.current.suspend();
      setPlayState('paused');
    }
  };

  const handleSoundChange = (soundKey: string) => {
    const wasPlaying = playState === 'playing';
    stopSound();
    setCurrentSound(soundKey);
    
    // If it was playing, restart with new sound
    if (wasPlaying) {
      setTimeout(() => playSound(), 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  return (
    <Card className="plant-card border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-800 mb-1">🎵 Ambient Garden Sounds</h3>
              <p className="text-sm font-semibold text-green-600">
                {playState === 'playing' ? `♪ Playing: ${sounds[currentSound as keyof typeof sounds].name}` : 
                 playState === 'paused' ? `⏸️ Paused: ${sounds[currentSound as keyof typeof sounds].name}` : 
                 'Relaxing nature sounds for your garden'}
              </p>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={playSound}
              disabled={playState === 'playing'}
              variant={playState === 'playing' ? "secondary" : "default"}
              size="sm"
              className="garden-button font-semibold"
            >
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
            
            <Button
              onClick={pauseSound}
              disabled={playState !== 'playing'}
              variant="outline"
              size="sm"
              className="border-green-300 hover:bg-green-100 font-semibold"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            
            <Button
              onClick={stopSound}
              disabled={playState === 'stopped'}
              variant="outline"
              size="sm"
              className="border-red-300 hover:bg-red-100 text-red-600 font-semibold"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
          
          {/* Sound Selection */}
          <div>
            <p className="text-sm font-bold text-green-700 mb-2">Choose Your Sound:</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(sounds).map(([key, sound]) => (
                <Button
                  key={key}
                  onClick={() => handleSoundChange(key)}
                  variant={currentSound === key ? "default" : "ghost"}
                  size="sm"
                  className={`text-sm px-3 py-2 font-semibold ${
                    currentSound === key 
                      ? "garden-button shadow-lg" 
                      : "text-green-700 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  {sound.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
