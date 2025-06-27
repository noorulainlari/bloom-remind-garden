
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export const SoundToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for nature sounds
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    // You would replace this with actual nature sound URLs
    // For now, we'll use a placeholder that won't actually play
    audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXrTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAoUXbTp66hVFApGn+DyvGIcBjiS2O/NeSsFJHfI8N2QQAo=';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // In a real implementation, you'd have actual nature sound files
      audioRef.current.play().catch(() => {
        // Silently handle the error since we're using a placeholder
      });
      setIsPlaying(true);
    }
  };

  return (
    <Button
      onClick={toggleSound}
      className="sound-toggle fixed bottom-4 right-4 z-50"
      size="lg"
      title={isPlaying ? "Turn off garden sounds" : "Turn on relaxing garden sounds"}
    >
      {isPlaying ? (
        <Volume2 className="h-6 w-6" />
      ) : (
        <VolumeX className="h-6 w-6" />
      )}
    </Button>
  );
};
