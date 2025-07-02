
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, Smartphone } from 'lucide-react';

export const PlantCareReminders = () => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false
  });

  const upcomingReminders = [
    { plant: 'Fiddle Leaf Fig', action: 'Water', time: '2 hours', urgent: true },
    { plant: 'Snake Plant', action: 'Fertilize', time: 'Tomorrow', urgent: false },
    { plant: 'Pothos', action: 'Prune', time: '3 days', urgent: false }
  ];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Smart Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Notification Settings */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Notification Preferences</h3>
            <div className="space-y-2">
              {Object.entries(notifications).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm capitalize">{type} Notifications</span>
                  </div>
                  <Switch 
                    checked={enabled}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [type]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Upcoming Care</h3>
            <div className="space-y-2">
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{reminder.plant}</p>
                      <p className="text-xs text-gray-600">{reminder.action}</p>
                    </div>
                  </div>
                  <Badge variant={reminder.urgent ? 'destructive' : 'secondary'}>
                    {reminder.time}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
