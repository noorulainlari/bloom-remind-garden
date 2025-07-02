
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface PlantInventoryProps {
  plants: any[];
}

export const PlantInventory = ({ plants }: PlantInventoryProps) => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Package className="h-5 w-5" />
          Plant Inventory ({plants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Manage your complete plant collection with detailed records and tracking.</p>
      </CardContent>
    </Card>
  );
};
