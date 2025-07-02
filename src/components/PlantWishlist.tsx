
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export const PlantWishlist = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Heart className="h-5 w-5" />
          Wishlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Keep track of plants you want to add to your collection.</p>
      </CardContent>
    </Card>
  );
};
