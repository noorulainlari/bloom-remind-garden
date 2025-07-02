
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine } from 'lucide-react';

interface PlantEcosystemProps {
  plants: any[];
}

export const PlantEcosystem = ({ plants }: PlantEcosystemProps) => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <TreePine className="h-5 w-5" />
          Ecosystem Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Manage plant relationships and create optimal growing ecosystems.</p>
      </CardContent>
    </Card>
  );
};
