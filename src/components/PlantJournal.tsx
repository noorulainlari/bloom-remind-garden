
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Calendar, Star, Image } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  rating: number;
  tags: string[];
  images: string[];
}

interface PlantJournalProps {
  plant: any;
}

export const PlantJournal = ({ plant }: PlantJournalProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      title: 'New Growth Spotted!',
      content: 'Noticed two new leaves emerging from the main stem. The plant seems to be responding well to the new location.',
      rating: 5,
      tags: ['growth', 'healthy'],
      images: []
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', rating: 5, tags: '' });

  const addEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: newEntry.title,
      content: newEntry.content,
      rating: newEntry.rating,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      images: []
    };
    setEntries([entry, ...entries]);
    setNewEntry({ title: '', content: '', rating: 5, tags: '' });
    setShowAddForm(false);
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <BookOpen className="h-5 w-5" />
          Plant Journal
        </CardTitle>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="space-y-3 p-4 bg-green-50 rounded-lg">
            <Input
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
            />
            <Textarea
              placeholder="What happened today with your plant?"
              value={newEntry.content}
              onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Tags (comma separated)"
                value={newEntry.tags}
                onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
              />
              <select 
                value={newEntry.rating}
                onChange={(e) => setNewEntry({...newEntry, rating: Number(e.target.value)})}
                className="px-3 py-2 border rounded-md"
              >
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{n} ⭐</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addEntry} size="sm">Save Entry</Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {entries.map(entry => (
            <div key={entry.id} className="p-3 bg-white border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{entry.title}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({length: entry.rating}).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {entry.date}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{entry.content}</p>
              <div className="flex gap-1 flex-wrap">
                {entry.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
