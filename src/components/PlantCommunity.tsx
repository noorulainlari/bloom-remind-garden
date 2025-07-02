
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageCircle, Heart, Share } from 'lucide-react';

export const PlantCommunity = () => {
  const communityPosts = [
    { 
      id: 1, 
      user: 'PlantMom123', 
      plant: 'Monstera Deliciosa', 
      content: 'Look at this new leaf! 🌿', 
      likes: 23, 
      comments: 5 
    },
    { 
      id: 2, 
      user: 'GreenThumb', 
      plant: 'Snake Plant', 
      content: 'Tips for winter care?', 
      likes: 12, 
      comments: 8 
    }
  ];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Plant Community
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communityPosts.map(post => (
            <div key={post.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{post.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{post.user}</p>
                  <Badge variant="outline" className="text-xs">{post.plant}</Badge>
                </div>
              </div>
              <p className="text-sm mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-red-500">
                  <Heart className="h-4 w-4" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1 hover:text-green-500">
                  <Share className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          ))}
          <Button className="w-full" variant="outline">
            Join Community Discussion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
