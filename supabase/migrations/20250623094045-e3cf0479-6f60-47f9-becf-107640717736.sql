
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role DEFAULT 'user',
  consent_to_reminders BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plants master data table
CREATE TABLE public.plant_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  watering_interval_days INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user plants table
CREATE TABLE public.user_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_name TEXT NOT NULL,
  scientific_name TEXT,
  watering_interval_days INTEGER NOT NULL,
  last_watered DATE DEFAULT CURRENT_DATE,
  next_water_date DATE NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create watering logs table
CREATE TABLE public.watering_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES public.user_plants(id) ON DELETE CASCADE,
  watered_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create static pages table for admin editing
CREATE TABLE public.static_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watering_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.static_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for plant species (readable by all authenticated users)
CREATE POLICY "Authenticated users can view plant species" ON public.plant_species
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage plant species" ON public.plant_species
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for user plants
CREATE POLICY "Users can view own plants" ON public.user_plants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plants" ON public.user_plants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plants" ON public.user_plants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plants" ON public.user_plants
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all plants" ON public.user_plants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for watering logs
CREATE POLICY "Users can view own watering logs" ON public.watering_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_plants 
      WHERE id = plant_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own watering logs" ON public.watering_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_plants 
      WHERE id = plant_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for static pages
CREATE POLICY "Anyone can view static pages" ON public.static_pages
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage static pages" ON public.static_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update next_water_date automatically
CREATE OR REPLACE FUNCTION update_next_water_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.next_water_date = NEW.last_watered + INTERVAL '1 day' * NEW.watering_interval_days;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating next_water_date
CREATE TRIGGER update_plant_next_water_date
  BEFORE UPDATE ON public.user_plants
  FOR EACH ROW
  EXECUTE FUNCTION update_next_water_date();

-- Create trigger for new plants
CREATE TRIGGER set_plant_next_water_date
  BEFORE INSERT ON public.user_plants
  FOR EACH ROW
  EXECUTE FUNCTION update_next_water_date();

-- Insert default static pages
INSERT INTO public.static_pages (slug, title, content, meta_title, meta_description) VALUES
('home', 'Online Plant Watering Reminder – Never Forget to Water Again', 
 '<h1>Welcome to Plant Care Tracker</h1><p>Never forget to water your plants again! Our easy-to-use tool helps you track your indoor plants and sends email reminders when it''s time to water.</p>', 
 'Free Plant Watering Reminder Tool – Indoor Plant Care Tracker',
 'Create a plant care schedule and get free email reminders. No signup needed.'),
('about', 'About Us', 
 '<h1>About Plant Care Tracker</h1><p>We''re passionate about helping you keep your indoor plants healthy and thriving.</p>', 
 'About Plant Care Tracker', 
 'Learn about our mission to help plant lovers care for their green friends.'),
('contact', 'Contact Us', 
 '<h1>Contact Us</h1><p>Get in touch with us for any questions or feedback.</p>', 
 'Contact Plant Care Tracker', 
 'Contact us for support, questions, or feedback about our plant care tool.'),
('privacy', 'Privacy Policy', 
 '<h1>Privacy Policy</h1><p>Your privacy is important to us. This policy explains how we handle your data.</p>', 
 'Privacy Policy - Plant Care Tracker', 
 'Read our privacy policy to understand how we protect your personal information.'),
('terms', 'Terms & Conditions', 
 '<h1>Terms & Conditions</h1><p>By using our service, you agree to these terms and conditions.</p>', 
 'Terms & Conditions - Plant Care Tracker', 
 'Read our terms and conditions for using the Plant Care Tracker service.');

-- Insert sample plant species data
INSERT INTO public.plant_species (name, scientific_name, watering_interval_days) VALUES
('Snake Plant', 'Sansevieria trifasciata', 14),
('Pothos', 'Epipremnum aureum', 7),
('Spider Plant', 'Chlorophytum comosum', 7),
('Peace Lily', 'Spathiphyllum wallisii', 7),
('Rubber Plant', 'Ficus elastica', 7),
('Monstera', 'Monstera deliciosa', 7),
('ZZ Plant', 'Zamioculcas zamiifolia', 14),
('Fiddle Leaf Fig', 'Ficus lyrata', 7),
('Aloe Vera', 'Aloe barbadensis', 14),
('Philodendron', 'Philodendron hederaceum', 7);
