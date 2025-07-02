
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export const PlantCareBot = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Bot className="h-5 w-5" />
          Care Bot Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">24/7 AI assistant for instant plant care advice and troubleshooting.</p>
      </CardContent>
    </Card>
  );
};
