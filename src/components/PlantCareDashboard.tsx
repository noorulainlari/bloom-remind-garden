
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlantCareGuide } from './PlantCareGuide';
import { PlantMoodTracker } from './PlantMoodTracker';
import { PlantQuickActions } from './PlantQuickActions';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PlantCareDashboardProps {
  plants: any[];
}

export const PlantCareDashboard = ({ plants }: PlantCareDashboardProps) => {
  const [selectedPlant, setSelectedPlant] = useState(plants[0]);

  const careData = [
    { name: 'Watered', value: 12 },
    { name: 'Fertilized', value: 3 },
    { name: 'Pruned', value: 2 },
    { name: 'Repotted', value: 1 }
  ];

  const healthData = [
    { status: 'Healthy', count: plants.filter(p => Math.random() > 0.3).length },
    { status: 'Warning', count: plants.filter(p => Math.random() > 0.8).length },
    { status: 'Critical', count: plants.filter(p => Math.random() > 0.9).length }
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const handleQuickAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedPlant?.plant_name}`);
  };

  if (plants.length === 0) return null;

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="text-green-800">🌿 Plant Care Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Care Activities (This Month)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={careData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-medium mb-2">Plant Health Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={healthData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <div className="flex gap-2 flex-wrap mb-4">
              {plants.map(plant => (
                <Button
                  key={plant.id}
                  variant={selectedPlant?.id === plant.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlant(plant)}
                >
                  {plant.custom_name || plant.plant_name}
                </Button>
              ))}
            </div>
            
            {selectedPlant && (
              <div className="space-y-4">
                <PlantCareGuide plantName={selectedPlant.plant_name} />
                <PlantMoodTracker plant={selectedPlant} />
                <PlantQuickActions plant={selectedPlant} onAction={handleQuickAction} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {plants.reduce((acc, plant) => acc + (plant.watering_interval_days || 7), 0) / plants.length || 0}
                </div>
                <div className="text-sm text-green-600">Avg. Watering Days</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {plants.filter(plant => 
                    plant.last_watered_timestamp && 
                    new Date(plant.last_watered_timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                  ).length}
                </div>
                <div className="text-sm text-blue-600">Watered This Week</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {Math.floor(Math.random() * 100)}%
                </div>
                <div className="text-sm text-purple-600">Care Completion</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Upcoming Care Tasks</h3>
              {plants.slice(0, 5).map(plant => (
                <div key={plant.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{plant.custom_name || plant.plant_name}</p>
                    <p className="text-sm text-gray-600">Next watering: {plant.next_water_date}</p>
                  </div>
                  <Badge variant="outline">
                    {Math.ceil((new Date(plant.next_water_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
