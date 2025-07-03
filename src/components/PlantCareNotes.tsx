
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StickyNote, Plus, Save } from 'lucide-react';

export const PlantCareNotes = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, text: 'Leaves looking healthier after repotting', date: '2024-01-15' },
    { id: 2, text: 'Added fertilizer - growth looking good', date: '2024-01-10' }
  ]);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([
        { id: Date.now(), text: newNote, date: new Date().toISOString().split('T')[0] },
        ...notes
      ]);
      setNewNote('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-yellow-500" />
          Care Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a note about your plant..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="text-sm"
              rows={2}
            />
            <Button onClick={addNote} size="sm" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <div className="text-sm">{note.text}</div>
                <Badge variant="outline" className="text-xs mt-1">{note.date}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
