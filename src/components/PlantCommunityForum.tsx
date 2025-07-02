
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export const PlantCommunityForum = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <MessageSquare className="h-5 w-5" />
          Community Forum
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Connect with plant enthusiasts, ask questions, and share experiences.</p>
      </CardContent>
    </Card>
  );
};
