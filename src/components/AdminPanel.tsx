
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Save, Users, Leaf, FileText } from 'lucide-react';

interface UserPlant {
  id: string;
  plant_name: string;
  scientific_name: string;
  user_id: string;
  last_watered: string;
  next_water_date: string;
  user_email?: string; // Made optional since we might not have the email
}

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
}

export const AdminPanel = () => {
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    
    // Load all user plants without trying to join with profiles
    const { data: plantsData, error: plantsError } = await supabase
      .from('user_plants')
      .select(`
        id,
        plant_name,
        scientific_name,
        user_id,
        last_watered,
        next_water_date
      `)
      .order('created_at', { ascending: false });

    if (plantsError) {
      console.error('Error loading user plants:', plantsError);
      toast({
        title: "Error",
        description: "Failed to load user plants.",
        variant: "destructive",
      });
    } else {
      // Get user emails separately for plants that have user_ids
      const plantsWithEmails = await Promise.all(
        (plantsData || []).map(async (plant) => {
          if (plant.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', plant.user_id)
              .single();
            
            return {
              ...plant,
              user_email: profile?.email || 'Unknown User'
            };
          }
          return {
            ...plant,
            user_email: 'Anonymous User'
          };
        })
      );
      
      setUserPlants(plantsWithEmails);
    }

    // Load static pages
    const { data: pagesData, error: pagesError } = await supabase
      .from('static_pages')
      .select('*')
      .order('slug');

    if (pagesError) {
      console.error('Error loading static pages:', pagesError);
    } else {
      setStaticPages(pagesData || []);
    }

    setLoading(false);
  };

  const deleteUserPlant = async (plantId: string) => {
    const { error } = await supabase
      .from('user_plants')
      .delete()
      .eq('id', plantId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete plant.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Plant Deleted",
        description: "Plant has been removed.",
      });
      loadAdminData();
    }
  };

  const updateStaticPage = async (page: StaticPage) => {
    const { error } = await supabase
      .from('static_pages')
      .update({
        title: page.title,
        content: page.content,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', page.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update page.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Page Updated",
        description: "Static page has been updated successfully.",
      });
      setEditingPage(null);
      loadAdminData();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading admin data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-700">Admin Panel</h1>
      </div>

      <Tabs defaultValue="plants" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plants" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            User Plants ({userPlants.length})
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Static Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All User Plants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPlants.map((plant) => (
                  <div key={plant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{plant.plant_name}</h3>
                      {plant.scientific_name && (
                        <p className="text-sm text-gray-500 italic">{plant.scientific_name}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        Owner: {plant.user_email || 'Anonymous User'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last watered: {plant.last_watered} | Next: {plant.next_water_date}
                      </p>
                    </div>
                    <Button
                      onClick={() => deleteUserPlant(plant.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {userPlants.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No user plants found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          {editingPage ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Page: {editingPage.slug}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="page-title">Title</Label>
                  <Input
                    id="page-title"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({
                      ...editingPage,
                      title: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page-content">Content</Label>
                  <Textarea
                    id="page-content"
                    value={editingPage.content}
                    onChange={(e) => setEditingPage({
                      ...editingPage,
                      content: e.target.value
                    })}
                    rows={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    value={editingPage.meta_title || ''}
                    onChange={(e) => setEditingPage({
                      ...editingPage,
                      meta_title: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    value={editingPage.meta_description || ''}
                    onChange={(e) => setEditingPage({
                      ...editingPage,
                      meta_description: e.target.value
                    })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => updateStaticPage(editingPage)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPage(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Static Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staticPages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{page.title}</h3>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                      <Button
                        onClick={() => setEditingPage(page)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
