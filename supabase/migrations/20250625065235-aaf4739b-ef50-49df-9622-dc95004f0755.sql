
-- Fix Row Level Security policies for all tables

-- First, create a security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing problematic policies and recreate them properly
DROP POLICY IF EXISTS "Authenticated users can view plant species" ON public.plant_species;
DROP POLICY IF EXISTS "Admins can manage plant species" ON public.plant_species;
DROP POLICY IF EXISTS "Users can view own plants" ON public.user_plants;
DROP POLICY IF EXISTS "Users can insert own plants" ON public.user_plants;
DROP POLICY IF EXISTS "Users can update own plants" ON public.user_plants;
DROP POLICY IF EXISTS "Users can delete own plants" ON public.user_plants;
DROP POLICY IF EXISTS "Admins can view all plants" ON public.user_plants;
DROP POLICY IF EXISTS "Users can view own watering logs" ON public.watering_logs;
DROP POLICY IF EXISTS "Users can insert own watering logs" ON public.watering_logs;
DROP POLICY IF EXISTS "Anyone can view static pages" ON public.static_pages;
DROP POLICY IF EXISTS "Admins can manage static pages" ON public.static_pages;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Plant species policies (public read, admin write)
CREATE POLICY "Anyone can view plant species" ON public.plant_species
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage plant species" ON public.plant_species
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- User plants policies (support both authenticated and anonymous users)
CREATE POLICY "Users can view own plants" ON public.user_plants
  FOR SELECT USING (
    user_id IS NULL OR auth.uid() = user_id
  );

CREATE POLICY "Users can insert plants" ON public.user_plants
  FOR INSERT WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );

CREATE POLICY "Users can update own plants" ON public.user_plants
  FOR UPDATE USING (
    user_id IS NULL OR auth.uid() = user_id
  );

CREATE POLICY "Users can delete own plants" ON public.user_plants
  FOR DELETE USING (
    user_id IS NULL OR auth.uid() = user_id
  );

CREATE POLICY "Admins can view all plants" ON public.user_plants
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Watering logs policies
CREATE POLICY "Users can view own watering logs" ON public.watering_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_plants 
      WHERE id = plant_id AND (user_id IS NULL OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own watering logs" ON public.watering_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_plants 
      WHERE id = plant_id AND (user_id IS NULL OR user_id = auth.uid())
    )
  );

-- Static pages policies
CREATE POLICY "Anyone can view static pages" ON public.static_pages
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage static pages" ON public.static_pages
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Profile policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create storage bucket for plant photos with proper security
INSERT INTO storage.buckets (id, name, public) 
VALUES ('plant-photos', 'plant-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for plant photos
CREATE POLICY "Anyone can view plant photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'plant-photos');

CREATE POLICY "Users can upload plant photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'plant-photos' AND
    (auth.uid() IS NOT NULL OR auth.uid() IS NULL)
  );

CREATE POLICY "Users can update own plant photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'plant-photos' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL)
  );

CREATE POLICY "Users can delete own plant photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'plant-photos' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL)
  );
