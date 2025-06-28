
-- Add status column to user_plants table
ALTER TABLE user_plants ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE user_plants ADD COLUMN IF NOT EXISTS custom_name TEXT;
ALTER TABLE user_plants ADD COLUMN IF NOT EXISTS last_watered_timestamp TIMESTAMP WITH TIME ZONE;

-- Create plant_reminders table
CREATE TABLE IF NOT EXISTS plant_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID REFERENCES user_plants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('fertilizing', 'pruning', 'misting', 'rotating', 'repotting')),
  interval_days INTEGER NOT NULL DEFAULT 30,
  last_completed DATE NOT NULL DEFAULT CURRENT_DATE,
  next_due_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to plant_reminders
ALTER TABLE plant_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for plant_reminders
CREATE POLICY "Users can view their own plant reminders" 
  ON plant_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plant reminders" 
  ON plant_reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plant reminders" 
  ON plant_reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plant reminders" 
  ON plant_reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);
