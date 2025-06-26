
-- Create the plant-photos storage bucket
insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', true);

-- Create policy for plant photos - allow authenticated users to insert their own photos
CREATE POLICY "Users can upload plant photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'plant-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for plant photos - allow public read access
CREATE POLICY "Anyone can view plant photos" ON storage.objects
FOR SELECT USING (bucket_id = 'plant-photos');

-- Create policy for plant photos - allow users to delete their own photos
CREATE POLICY "Users can delete their own plant photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'plant-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
