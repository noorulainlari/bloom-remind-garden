
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface PlantHealthReportProps {
  plants: any[];
}

export const PlantHealthReport = ({ plants }: PlantHealthReportProps) => {
  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <FileText className="h-5 w-5" />
          Health Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">Generate comprehensive health reports for your plants.</p>
      </CardContent>
    </Card>
  );
};
