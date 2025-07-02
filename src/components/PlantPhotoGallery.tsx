
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Image, Filter, Download, Share2, Heart, Eye } from 'lucide-react';

interface PlantPhotoGalleryProps {
  plants: any[];
}

export const PlantPhotoGallery = ({ plants }: PlantPhotoGalleryProps) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const mockPhotos = [
    { id: 1, plant: 'Snake Plant', date: '2024-01-15', url: '/placeholder.svg', likes: 12, views: 45, tags: ['growth', 'healthy'] },
    { id: 2, plant: 'Monstera', date: '2024-01-10', url: '/placeholder.svg', likes: 8, views: 32, tags: ['new-leaf', 'fenestration'] },
    { id: 3, plant: 'Pothos', date: '2024-01-08', url: '/placeholder.svg', likes: 15, views: 67, tags: ['propagation', 'roots'] }
  ];

  const filters = ['all', 'recent', 'popular', 'growth', 'flowers', 'issues'];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Camera className="h-5 w-5" />
          Plant Photo Gallery
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === 'timeline' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {filters.map(filter => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className="text-xs capitalize"
            >
              <Filter className="h-3 w-3 mr-1" />
              {filter}
            </Button>
          ))}
        </div>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-4`}>
          {mockPhotos.map(photo => (
            <div key={photo.id} className="relative group bg-white rounded-lg overflow-hidden shadow-sm border">
              <div className="aspect-square bg-green-50 flex items-center justify-center">
                <Image className="h-12 w-12 text-green-300" />
              </div>
              
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{photo.plant}</p>
                    <p className="text-xs text-gray-500">{photo.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <Heart className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {photo.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {photo.views}
                    </span>
                  </div>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex gap-1 flex-wrap">
                  {photo.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">📸 Photo Tips</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Take photos in natural light for best results</li>
            <li>• Document growth progress weekly</li>
            <li>• Capture any issues for expert help</li>
            <li>• Use macro mode for detailed shots</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
