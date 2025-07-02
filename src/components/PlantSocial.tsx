
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Users, Camera, Send } from 'lucide-react';

interface Post {
  id: string;
  user: string;
  avatar: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  plantTag: string;
  liked: boolean;
}

export const PlantSocial = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: 'GreenThumb_Sarah',
      avatar: 'S',
      timestamp: '2 hours ago',
      content: 'My snake plant just grew a new leaf! 🌱 Anyone else notice faster growth in winter?',
      image: undefined,
      likes: 12,
      comments: 3,
      plantTag: 'Snake Plant',
      liked: false
    },
    {
      id: '2',
      user: 'PlantDad_Mike',
      avatar: 'M',
      timestamp: '5 hours ago',
      content: 'Repotted my monstera today. The root system was incredible! Tips for faster growth?',
      likes: 8,
      comments: 7,
      plantTag: 'Monstera',
      liked: true
    }
  ]);
  
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const addPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        user: 'You',
        avatar: 'Y',
        timestamp: 'Just now',
        content: newPost,
        likes: 0,
        comments: 0,
        plantTag: 'General',
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setShowNewPost(false);
    }
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Users className="h-5 w-5" />
          Plant Community
        </CardTitle>
        <Button onClick={() => setShowNewPost(!showNewPost)} size="sm">
          <Camera className="h-4 w-4 mr-2" />
          Share Update
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showNewPost && (
          <div className="space-y-3 p-4 bg-green-50 rounded-lg">
            <Textarea
              placeholder="Share your plant journey..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={addPost} size="sm">
                <Send className="h-4 w-4 mr-1" />
                Post
              </Button>
              <Button onClick={() => setShowNewPost(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map(post => (
            <div key={post.id} className="p-4 bg-white border rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {post.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{post.user}</span>
                    <Badge variant="outline" className="text-xs">{post.plantTag}</Badge>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                  {post.image && (
                    <div className="mb-3">
                      <img src={post.image} alt="Plant post" className="rounded-lg max-h-48 object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={`text-xs ${post.liked ? 'text-red-600' : 'text-gray-600'}`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
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
