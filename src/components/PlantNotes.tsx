
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Calendar, Edit3, Trash2 } from 'lucide-react';

interface PlantNotesProps {
  plant: any;
}

interface Note {
  id: string;
  date: string;
  category: string;
  content: string;
  important: boolean;
}

export const PlantNotes = ({ plant }: PlantNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      date: '2024-02-15',
      category: 'Growth',
      content: 'New leaf unfurling! Plant seems very happy with current placement.',
      important: true
    },
    {
      id: '2', 
      date: '2024-02-10',
      category: 'Watering',
      content: 'Soil was quite dry, increased watering frequency slightly.',
      important: false
    },
    {
      id: '3',
      date: '2024-02-05',
      category: 'Health',
      content: 'Noticed some brown tips on older leaves - might be low humidity.',
      important: true
    }
  ]);
  
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [showAddNote, setShowAddNote] = useState(false);

  const categories = ['General', 'Watering', 'Growth', 'Health', 'Fertilizing', 'Repotting'];

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Growth': return 'bg-green-100 text-green-800';
      case 'Watering': return 'bg-blue-100 text-blue-800';
      case 'Health': return 'bg-red-100 text-red-800';
      case 'Fertilizing': return 'bg-yellow-100 text-yellow-800';
      case 'Repotting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        category: selectedCategory,
        content: newNote,
        important: false
      };
      setNotes([note, ...notes]);
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <FileText className="h-5 w-5" />
          Plant Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Notes for {plant?.custom_name || plant?.plant_name}</h3>
          <Button
            size="sm"
            onClick={() => setShowAddNote(!showAddNote)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {showAddNote && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Textarea
              placeholder="Write your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px]"
            />
            
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddNote}>
                Save Note
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddNote(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Recent Notes ({notes.length})</h4>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notes yet. Add your first note above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(note.category)}>
                        {note.category}
                      </Badge>
                      {note.important && (
                        <Badge className="bg-orange-100 text-orange-800">
                          Important
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {note.date}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">📝 Pro Tip</p>
          <p className="text-xs text-blue-700">
            Keep detailed notes about your plant's progress, changes in care routine, and any issues you notice. This helps track patterns and improve care over time!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
