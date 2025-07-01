
import { useState, useRef, useEffect } from 'react';

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

export const SOUND_OPTIONS: SoundOption[] = [
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

export const useSoundManager = () => {
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
      
      const normalizedVolume = (volume / 100) * 0.15;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(normalizedVolume, audioContext.currentTime + 0.5);
      
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

  const toggleSound = (soundId: SoundType) => {
    const newActiveSounds = new Set(activeSounds);
    
    if (soundId === 'silent') {
      stopAllSounds();
      newActiveSounds.clear();
      newActiveSounds.add('silent');
    } else {
      if (activeSounds.has(soundId)) {
        stopSound(soundId);
        newActiveSounds.delete(soundId);
        newActiveSounds.delete('silent');
      } else {
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

  const updateVolume = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    
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

  return {
    activeSounds,
    volume,
    toggleSound,
    updateVolume,
    activeSoundCount: activeSounds.has('silent') ? 0 : activeSounds.size
  };
};
