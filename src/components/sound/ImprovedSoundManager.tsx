import { useState, useRef, useEffect } from 'react';

export type SoundType = 'birds' | 'rain' | 'wind' | 'forest' | 'ocean' | 'garden' | 'silent';

export interface SoundOption {
  id: SoundType;
  name: string;
  emoji: string;
  description: string;
  url: string;
}

// Using royalty-free nature sounds that work well on mobile
export const IMPROVED_SOUND_OPTIONS: SoundOption[] = [
  {
    id: 'birds',
    name: 'Morning Birds',
    emoji: '🐦',
    description: 'Peaceful morning bird songs',
    url: '/sounds/birds.mp3'
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    emoji: '🌧️',
    description: 'Soft rainfall ambience',
    url: '/sounds/rain.mp3'
  },
  {
    id: 'wind',
    name: 'Forest Wind',
    emoji: '🍃',
    description: 'Wind through leaves',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: 'forest',
    name: 'Forest Ambience',
    emoji: '🌲',
    description: 'Deep forest sounds',
    url: '/sounds/forest.mp3'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    emoji: '🌊',
    description: 'Gentle ocean waves',
    url: 'https://pixabay.com/sound-effects/ocean-waves-112906.mp3'
  },
  {
    id: 'garden',
    name: 'Garden Ambience',
    emoji: '🌺',
    description: 'Peaceful garden with insects',
    url: 'https://pixabay.com/sound-effects/crickets-and-birds-ambiance-16074.mp3'
  },
  {
    id: 'silent',
    name: 'Silent Mode',
    emoji: '🔇',
    description: 'No sound',
    url: ''
  }
];

export const useImprovedSoundManager = () => {
  const [activeSound, setActiveSound] = useState<SoundType>('silent');
  const [volume, setVolume] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout>();

  // Load preferences from localStorage
  useEffect(() => {
    const savedSound = localStorage.getItem('garden-active-sound');
    const savedVolume = localStorage.getItem('garden-sound-volume');
    const savedPlaying = localStorage.getItem('garden-sound-playing');
    
    if (savedSound && savedSound !== 'silent') {
      setActiveSound(savedSound as SoundType);
    }
    
    if (savedVolume) {
      setVolume(parseInt(savedVolume, 10));
    }
    
    // Don't auto-play on mobile - user must interact first
    if (savedPlaying === 'true' && !isMobileDevice()) {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        playSound(savedSound as SoundType || 'birds');
      }, 500);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('garden-active-sound', activeSound);
    localStorage.setItem('garden-sound-volume', volume.toString());
    localStorage.setItem('garden-sound-playing', isPlaying.toString());
  }, [activeSound, volume, isPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const createAudioElement = (soundUrl: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      // Set up event listeners before setting src
      audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
      audio.addEventListener('error', () => reject(new Error('Failed to load audio')), { once: true });
      
      // Configure audio for looping and mobile compatibility
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = volume / 100;
      
      // Better mobile compatibility
      audio.crossOrigin = 'anonymous';
      
      // Set the source last
      audio.src = soundUrl;
    });
  };

  const playSound = async (soundId: SoundType) => {
    try {
      if (soundId === 'silent') {
        await stopSound();
        setActiveSound('silent');
        return;
      }

      setIsLoading(true);
      
      // Stop current sound first
      if (audioRef.current) {
        await stopSound();
      }

      const soundOption = IMPROVED_SOUND_OPTIONS.find(s => s.id === soundId);
      if (!soundOption || !soundOption.url) {
        console.warn('Sound option not found or no URL:', soundId);
        setIsLoading(false);
        return;
      }

      // Create and configure new audio element
      const audio = await createAudioElement(soundOption.url);
      audioRef.current = audio;
      
      // Fade in effect
      audio.volume = 0;
      audio.currentTime = 0;
      
      await audio.play();
      fadeIn(audio, volume / 100);
      
      setActiveSound(soundId);
      setIsPlaying(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsLoading(false);
      setIsPlaying(false);
      
      // Fallback: try with user interaction
      if (error instanceof Error && error.message.includes('user interaction')) {
        console.log('Sound requires user interaction on mobile');
      }
    }
  };

  const stopSound = (): Promise<void> => {
    return new Promise((resolve) => {
      if (audioRef.current) {
        fadeOut(audioRef.current, () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
          }
          setIsPlaying(false);
          resolve();
        });
      } else {
        setIsPlaying(false);
        resolve();
      }
    });
  };

  const toggleSound = async () => {
    if (isPlaying) {
      await stopSound();
      setActiveSound('silent');
    } else {
      if (activeSound === 'silent') {
        await playSound('birds'); // Default to birds
      } else {
        await playSound(activeSound);
      }
    }
  };

  const fadeIn = (audio: HTMLAudioElement, targetVolume: number) => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    
    const fadeStep = targetVolume / 20; // 20 steps
    const fadeInterval = 50; // 50ms per step
    
    let currentVol = 0;
    const fade = () => {
      currentVol += fadeStep;
      if (currentVol >= targetVolume) {
        audio.volume = targetVolume;
        return;
      }
      audio.volume = currentVol;
      fadeTimeoutRef.current = setTimeout(fade, fadeInterval);
    };
    fade();
  };

  const fadeOut = (audio: HTMLAudioElement, callback: () => void) => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    
    const startVolume = audio.volume;
    const fadeStep = startVolume / 10; // 10 steps
    const fadeInterval = 50; // 50ms per step
    
    const fade = () => {
      audio.volume -= fadeStep;
      if (audio.volume <= 0) {
        audio.volume = 0;
        callback();
        return;
      }
      fadeTimeoutRef.current = setTimeout(fade, fadeInterval);
    };
    fade();
  };

  const updateVolume = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    activeSound,
    volume,
    isPlaying,
    isLoading,
    playSound,
    stopSound,
    toggleSound,
    updateVolume,
    isMobile: isMobileDevice()
  };
};