
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Camera, Bell, Settings, Sun, Scissors } from 'lucide-react';

export const QuickActions = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <Droplets className="h-4 w-4 mb-1 text-blue-500" />
            <span className="text-xs">Water</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <Camera className="h-4 w-4 mb-1 text-green-500" />
            <span className="text-xs">Photo</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <Bell className="h-4 w-4 mb-1 text-orange-500" />
            <span className="text-xs">Remind</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <Sun className="h-4 w-4 mb-1 text-yellow-500" />
            <span className="text-xs">Light</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <Scissors className="h-4 w-4 mb-1 text-purple-500" />
            <span className="text-xs">Prune</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto">
            <Settings className="h-4 w-4 mb-1 text-gray-500" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
