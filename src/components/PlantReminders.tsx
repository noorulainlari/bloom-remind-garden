
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Bell, Scissors, Droplets, Flower2, RotateCw, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { addDays, format, parseISO, isToday, isPast } from 'date-fns';

interface PlantReminder {
  id: string;
  plant_id: string;
  plant_name: string;
  reminder_type: 'fertilizing' | 'pruning' | 'misting' | 'rotating' | 'repotting';
  interval_days: number;
  last_completed: string;
  next_due_date: string;
  notes?: string;
}

interface PlantRemindersProps {
  userPlants: any[];
}

const REMINDER_TYPES = {
  fertilizing: { icon: Flower2, label: '🌸 Fertilizing', color: 'yellow' },
  pruning: { icon: Scissors, label: '✂️ Pruning', color: 'orange' },
  misting: { icon: Droplets, label: '💨 Misting', color: 'blue' },
  rotating: { icon: RotateCw, label: '🔄 Rotating', color: 'purple' },
  repotting: { icon: Plus, label: '🪴 Repotting', color: 'green' }
};

export const PlantReminders = ({ userPlants }: PlantRemindersProps) => {
  const [reminders, setReminders] = useState<PlantReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [reminderType, setReminderType] = useState<keyof typeof REMINDER_TYPES>('fertilizing');
  const [intervalDays, setIntervalDays] = useState(30);
  const [lastCompleted, setLastCompleted] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadReminders();
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('plant_reminders')
      .select(`
        *,
        user_plants!plant_id (plant_name)
      `)
      .eq('user_id', user.id)
      .order('next_due_date');

    if (error) {
      console.error('Error loading reminders:', error);
    } else {
      setReminders(data?.map(r => ({
        ...r,
        plant_name: r.user_plants?.plant_name || 'Unknown Plant'
      })) || []);
    }
  };

  const addReminder = async () => {
    if (!selectedPlantId || !user) return;

    const selectedPlant = userPlants.find(p => p.id === selectedPlantId);
    if (!selectedPlant) return;

    const nextDueDate = addDays(new Date(lastCompleted), intervalDays);

    const { error } = await supabase
      .from('plant_reminders')
      .insert({
        plant_id: selectedPlantId,
        user_id: user.id,
        reminder_type: reminderType,
        interval_days: intervalDays,
        last_completed: lastCompleted,
        next_due_date: nextDueDate.toISOString().split('T')[0],
        notes: notes || null
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add reminder.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "🔔 Reminder Added!",
      description: `${REMINDER_TYPES[reminderType].label} reminder set for ${selectedPlant.plant_name}`,
    });

    // Reset form
    setSelectedPlantId('');
    setReminderType('fertilizing');
    setIntervalDays(30);
    setLastCompleted(new Date().toISOString().split('T')[0]);
    setNotes('');
    setShowAddForm(false);
    
    loadReminders();
  };

  const markAsCompleted = async (reminder: PlantReminder) => {
    const today = new Date().toISOString().split('T')[0];
    const nextDueDate = addDays(new Date(today), reminder.interval_days);

    const { error } = await supabase
      .from('plant_reminders')
      .update({
        last_completed: today,
        next_due_date: nextDueDate.toISOString().split('T')[0]
      })
      .eq('id', reminder.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update reminder.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ Task Completed!",
      description: `${REMINDER_TYPES[reminder.reminder_type].label} completed for ${reminder.plant_name}`,
    });

    loadReminders();
  };

  const deleteReminder = async (reminderId: string) => {
    const { error } = await supabase
      .from('plant_reminders')
      .delete()
      .eq('id', reminderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete reminder.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "🗑️ Reminder Deleted",
      description: "Reminder has been removed.",
    });

    loadReminders();
  };

  const getReminderStatus = (nextDueDate: string) => {
    const date = parseISO(nextDueDate);
    if (isToday(date)) {
      return { text: 'Due Today', variant: 'default' as const, urgent: true };
    } else if (isPast(date)) {
      return { text: 'Overdue', variant: 'destructive' as const, urgent: true };
    } else {
      const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return { text: `Due in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`, variant: 'secondary' as const, urgent: false };
    }
  };

  if (!user) return null;

  return (
    <Card className="plant-card shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Plant Care Reminders
          </CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="garden-button"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Reminder
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showAddForm && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plant</Label>
                  <Select value={selectedPlantId} onValueChange={setSelectedPlantId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plant..." />
                    </SelectTrigger>
                    <SelectContent>
                      {userPlants.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id}>
                          {plant.custom_name || plant.plant_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reminder Type</Label>
                  <Select value={reminderType} onValueChange={(value: keyof typeof REMINDER_TYPES) => setReminderType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(REMINDER_TYPES).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interval (Days)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={intervalDays}
                    onChange={(e) => setIntervalDays(parseInt(e.target.value) || 30)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Last Completed</Label>
                  <Input
                    type="date"
                    value={lastCompleted}
                    onChange={(e) => setLastCompleted(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Input
                  placeholder="Add any specific notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addReminder} className="garden-button">
                  Add Reminder
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {reminders.length === 0 ? (
          <div className="text-center py-8 text-green-600">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No care reminders set yet.</p>
            <p className="text-sm opacity-75">Add reminders for fertilizing, pruning, and more!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => {
              const status = getReminderStatus(reminder.next_due_date);
              const ReminderIcon = REMINDER_TYPES[reminder.reminder_type].icon;

              return (
                <Card key={reminder.id} className={`${status.urgent ? 'ring-2 ring-orange-300' : 'border-green-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ReminderIcon className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">
                            {REMINDER_TYPES[reminder.reminder_type].label}
                          </div>
                          <div className="text-sm text-green-600">{reminder.plant_name}</div>
                          <div className="text-xs text-gray-500">
                            Every {reminder.interval_days} days • Last: {format(parseISO(reminder.last_completed), 'MMM dd')}
                          </div>
                          {reminder.notes && (
                            <div className="text-xs text-gray-600 mt-1">{reminder.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>
                          {status.text}
                        </Badge>
                        <Button
                          onClick={() => markAsCompleted(reminder)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete
                        </Button>
                        <Button
                          onClick={() => deleteReminder(reminder.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
