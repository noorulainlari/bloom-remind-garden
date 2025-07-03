
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, CheckCircle } from 'lucide-react';

export const PlantCareReminder = () => {
  const reminders = [
    { task: 'Water Monstera', time: '2 hours ago', urgent: true },
    { task: 'Fertilize Pothos', time: 'Tomorrow', urgent: false },
    { task: 'Rotate Snake Plant', time: 'In 3 days', urgent: false }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          Care Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {reminders.map((reminder, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded border">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-sm font-medium">{reminder.task}</div>
                  <div className="text-xs text-gray-500">{reminder.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {reminder.urgent && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
