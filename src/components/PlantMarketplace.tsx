
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, Search, MapPin, Star, Heart, Filter } from 'lucide-react';

interface PlantListing {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  seller: string;
  location: string;
  rating: number;
  image: string;
  condition: 'excellent' | 'good' | 'fair';
  size: 'small' | 'medium' | 'large';
  rare: boolean;
}

export const PlantMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const listings: PlantListing[] = [
    {
      id: '1',
      name: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      price: 45,
      seller: 'PlantLover_Jane',
      location: '2.5 miles away',
      rating: 4.8,
      image: '🌿',
      condition: 'excellent',
      size: 'medium',
      rare: false
    },
    {
      id: '2',
      name: 'Variegated Monstera',
      scientificName: 'Monstera deliciosa var.',
      price: 350,
      seller: 'RarePlants_Co',
      location: '5 miles away',
      rating: 4.9,
      image: '🌱',
      condition: 'excellent',
      size: 'small',
      rare: true
    },
    {
      id: '3',
      name: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      price: 25,
      seller: 'GreenThumb_Mike',
      location: '1.2 miles away',
      rating: 4.6,
      image: '🌵',
      condition: 'good',
      size: 'large',
      rare: false
    }
  ];

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || 
     (filter === 'rare' && listing.rare) ||
     (filter === 'affordable' && listing.price < 50))
  );

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <ShoppingCart className="h-5 w-5" />
          Plant Marketplace
        </CardTitle>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Plants</option>
            <option value="rare">Rare Only</option>
            <option value="affordable">Under $50</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 max-h-96 overflow-y-auto">
          {filteredListings.map(listing => (
            <div key={listing.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="text-4xl">{listing.image}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-green-800 flex items-center gap-2">
                        {listing.name}
                        {listing.rare && <Badge className="bg-purple-100 text-purple-800">Rare</Badge>}
                      </h4>
                      <p className="text-sm italic text-gray-600">{listing.scientificName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-700">${listing.price}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{listing.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-green-100">
                        {listing.seller[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{listing.seller}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {listing.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className={getConditionColor(listing.condition)}>
                        {listing.condition}
                      </Badge>
                      <Badge variant="outline">{listing.size}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
