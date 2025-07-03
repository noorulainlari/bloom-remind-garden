
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit } from 'lucide-react';

interface PlantNotesProps {
  plant: any;
}

export const PlantNotes = ({ plant }: PlantNotesProps) => {
  const [notes, setNotes] = useState([
    { id: 1, date: '2024-01-15', note: 'First new leaf spotted!', type: 'growth' },
    { id: 2, date: '2024-01-20', note: 'Moved to brighter location', type: 'care' }
  ]);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        note: newNote,
        type: 'general'
      };
      setNotes([note, ...notes]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'growth': return 'bg-green-100 text-green-800';
      case 'care': return 'bg-blue-100 text-blue-800';
      case 'problem': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-800">Plant Notes</span>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          size="sm" 
          variant="outline"
          className="text-amber-700 border-amber-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </div>

      {isAdding && (
        <div className="mb-4 space-y-2">
          <Textarea
            placeholder="Add a note about your plant..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <Button onClick={addNote} size="sm">Save</Button>
            <Button onClick={() => setIsAdding(false)} size="sm" variant="outline">Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-3 rounded border">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm text-gray-500">{note.date}</span>
              <Badge className={getNoteTypeColor(note.type)}>{note.type}</Badge>
            </div>
            <p className="text-sm text-gray-700">{note.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
