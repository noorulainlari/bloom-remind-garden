
import { Camera } from 'lucide-react';

interface PlantImageProps {
  photoUrl?: string;
  plantName: string;
  plantEmoji: string;
}

export const PlantImage = ({ photoUrl, plantName, plantEmoji }: PlantImageProps) => {
  if (photoUrl) {
    return (
      <div className="relative group">
        <img
          src={photoUrl}
          alt={plantName}
          className="w-full h-48 sm:h-56 object-cover rounded-xl shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-green-200"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 backdrop-blur-sm shadow-lg">
          <Camera className="h-5 w-5 text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-48 sm:h-56 garden-gradient rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden border-3 border-green-300">
      <div className="text-6xl sm:text-7xl animate-gentle-float drop-shadow-lg">{plantEmoji}</div>
      <div className="absolute inset-0 leaf-pattern opacity-40" />
    </div>
  );
};
