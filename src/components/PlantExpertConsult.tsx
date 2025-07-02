
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

export const PlantExpertConsult = () => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <UserCheck className="h-5 w-5" />
          Expert Consultation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Book consultations with certified plant care experts.</p>
      </CardContent>
    </Card>
  );
};
