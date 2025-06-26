
-- Add is_admin column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Update the specific user as admin
UPDATE profiles SET is_admin = TRUE WHERE id = 'd38c9abe-f0e3-429c-9dac-f11e49f9dc19';

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adsense_code TEXT DEFAULT '',
  analytics_code TEXT DEFAULT '',
  ads_txt TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row if table is empty
INSERT INTO admin_settings (adsense_code, analytics_code, ads_txt) 
SELECT '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM admin_settings LIMIT 1);

-- Create blog_posts table for SEO blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  image_alt TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 10 SEO blog posts (fixed with all required columns)
INSERT INTO blog_posts (slug, title, meta_title, meta_description, content, excerpt, image_url, image_alt) VALUES
(
  'how-often-water-indoor-plants',
  'How Often Should You Water Indoor Plants?',
  'How Often to Water Indoor Plants - Complete Guide 2025',
  'Learn the perfect watering schedule for indoor plants. Expert tips on frequency, signs of overwatering, and plant-specific needs.',
  '<h1>How Often Should You Water Indoor Plants?</h1><p>Watering indoor plants correctly is one of the most important aspects of plant care. Most houseplants need water when the top inch of soil feels dry to the touch.</p><h2>General Watering Guidelines</h2><ul><li><strong>Most houseplants:</strong> Every 7-10 days</li><li><strong>Succulents:</strong> Every 2-3 weeks</li><li><strong>Tropical plants:</strong> Every 5-7 days</li><li><strong>Cacti:</strong> Every 3-4 weeks</li></ul><h2>Signs Your Plant Needs Water</h2><p>Check these indicators before watering:</p><ul><li>Soil feels dry 1-2 inches down</li><li>Leaves appear slightly wilted</li><li>Pot feels lighter when lifted</li><li>Soil pulls away from pot edges</li></ul><h2>Use a Plant Watering Reminder Tool</h2><p>Never forget to water your plants again! Use our <a href="/">free plant watering reminder tool</a> to create custom schedules for all your plants and get email notifications when it is time to water.</p>',
  'Learn the perfect watering schedule for indoor plants with expert tips on frequency and plant-specific needs.',
  '/placeholder.svg',
  'Indoor plant watering guide illustration'
),
(
  'plant-watering-schedule-beginners-guide',
  'Plant Watering Schedule: Ultimate Beginner''s Guide',
  'Plant Watering Schedule Guide - Never Kill Plants Again',
  'Master plant watering with our beginner''s guide. Create schedules, avoid common mistakes, and keep your plants thriving.',
  '<h1>Plant Watering Schedule: Ultimate Beginner Guide</h1><p>Creating a proper watering schedule is essential for healthy plants. This comprehensive guide will help you develop a routine that keeps your plants thriving.</p><h2>Creating Your Watering Schedule</h2><p>Follow these steps to create an effective watering routine:</p><ol><li>Identify each plant species and their water needs</li><li>Group plants with similar requirements</li><li>Set consistent watering days</li><li>Monitor and adjust based on seasons</li></ol><h2>Common Beginner Mistakes</h2><ul><li>Watering on a fixed schedule regardless of plant needs</li><li>Using the same amount of water for all plants</li><li>Ignoring seasonal changes in water requirements</li><li>Not checking soil moisture before watering</li></ul><h2>Get Started with Our Free Tool</h2><p>Make plant care easier with our <a href="/">plant watering reminder tool</a>. Set up custom schedules and never forget to water your plants again!</p>',
  'Master plant watering with our comprehensive beginner''s guide to creating schedules and avoiding common mistakes.',
  '/placeholder.svg',
  'Plant watering schedule calendar illustration'
),
(
  'overwatering-plants-dangers',
  'Why Overwatering is Worse Than You Think',
  'Overwatering Plants: Hidden Dangers & How to Fix It',
  'Discover why overwatering kills more plants than underwatering. Learn signs, prevention, and recovery tips.',
  '<h1>Why Overwatering is Worse Than You Think</h1><p>Overwatering is the number one killer of houseplants, causing more plant deaths than any other factor. Understanding why is crucial for plant success.</p><h2>The Hidden Dangers of Overwatering</h2><ul><li><strong>Root rot:</strong> Soggy soil creates anaerobic conditions that kill roots</li><li><strong>Fungal infections:</strong> Excess moisture promotes harmful fungal growth</li><li><strong>Nutrient deficiency:</strong> Waterlogged roots cannot absorb nutrients properly</li><li><strong>Pest problems:</strong> Moist conditions attract gnats and other pests</li></ul><h2>Signs of Overwatering</h2><p>Watch for these warning signs:</p><ul><li>Yellow, mushy leaves</li><li>Moldy or smelly soil</li><li>Soft, black roots</li><li>Fungus gnats flying around the plant</li></ul><h2>Prevention is Key</h2><p>Use our <a href="/">plant watering reminder tool</a> to track watering schedules and avoid the overwatering trap. Set appropriate intervals for each plant type.</p>',
  'Learn why overwatering kills more plants than drought and how to prevent this common mistake.',
  '/placeholder.svg',
  'Overwatered plant with yellow leaves illustration'
),
(
  'top-5-plant-watering-reminder-apps-2025',
  'Top 5 Free Plant Watering Reminder Apps (2025)',
  '5 Best Plant Watering Apps 2025 - Free Reminder Tools',
  'Compare the top 5 plant watering reminder apps. Find the perfect tool to keep your plants healthy with automated schedules.',
  '<h1>Top 5 Free Plant Watering Reminder Apps (2025)</h1><p>Technology makes plant care easier than ever. Here are the best free plant watering reminder tools available today.</p><h2>1. Plant Care Tracker (Our Tool)</h2><p>Our <a href="/">free plant watering reminder tool</a> offers:</p><ul><li>No signup required for basic use</li><li>Email reminders with optional account</li><li>Custom watering schedules</li><li>Plant species database</li><li>Export schedules to CSV</li></ul><h2>2. PlantNet</h2><p>Great for plant identification with basic care reminders.</p><h2>3. PictureThis</h2><p>AI-powered plant identification with care schedules.</p><h2>4. Gardenize</h2><p>Comprehensive garden journal with reminder features.</p><h2>5. Moon & Garden</h2><p>Combines lunar calendar with plant care reminders.</p><h2>Why Choose Our Tool?</h2><p>Start using our <a href="/">plant watering reminder tool</a> today - no downloads required, works in any browser, and keeps your plants thriving!</p>',
  'Compare the best free plant watering reminder apps and tools to keep your plants healthy in 2025.',
  '/placeholder.svg',
  'Plant care apps comparison illustration'
),
(
  'succulent-watering-schedule-guide',
  'Succulent Watering Schedule: Weekly or Monthly?',
  'How Often to Water Succulents - Weekly vs Monthly Guide',
  'Learn the perfect succulent watering schedule. Discover whether weekly or monthly watering is better for your succulents.',
  '<h1>Succulent Watering Schedule: Weekly or Monthly?</h1><p>Succulents have unique watering needs that differ dramatically from other houseplants. Getting the schedule right is crucial for their survival.</p><h2>The Answer: It Depends</h2><p>Most succulents need water every 2-3 weeks, but several factors affect this:</p><ul><li><strong>Season:</strong> More frequent in summer, less in winter</li><li><strong>Pot size:</strong> Smaller pots dry out faster</li><li><strong>Humidity:</strong> Dry air requires more frequent watering</li><li><strong>Soil type:</strong> Well-draining soil dries faster</li></ul><h2>Seasonal Watering Schedule</h2><h3>Spring/Summer (Growing Season)</h3><ul><li>Indoor succulents: Every 10-14 days</li><li>Outdoor succulents: Every 7-10 days</li></ul><h3>Fall/Winter (Dormant Season)</h3><ul><li>Indoor succulents: Every 3-4 weeks</li><li>Outdoor succulents: Monthly or less</li></ul><h2>Track Your Succulent Schedule</h2><p>Use our <a href="/">plant watering reminder tool</a> to set up custom schedules for each succulent type and never guess when to water again!</p>',
  'Learn the perfect succulent watering schedule with seasonal guidelines and expert tips for healthy plants.',
  '/placeholder.svg',
  'Succulent garden watering schedule illustration'
),
(
  'phone-watering-reminder-setup',
  'How to Set a Watering Reminder on iPhone/Android',
  'Set Plant Watering Reminders on iPhone & Android - Easy Guide',
  'Step-by-step guide to set up plant watering reminders on your phone. iPhone and Android instructions included.',
  '<h1>How to Set a Watering Reminder on iPhone/Android</h1><p>Your smartphone can be the perfect plant care assistant. Here is how to set up watering reminders on both iPhone and Android devices.</p><h2>iPhone Reminder Setup</h2><ol><li>Open the Reminders app</li><li>Tap the "+" to create a new reminder</li><li>Type "Water [Plant Name]"</li><li>Tap the "i" icon to set details</li><li>Enable "Remind me on a day"</li><li>Set to repeat weekly/bi-weekly</li><li>Choose your preferred time</li></ol><h2>Android Reminder Setup</h2><ol><li>Open Google Assistant or Google Calendar</li><li>Say "Remind me to water plants every week"</li><li>Or manually create recurring calendar events</li><li>Set notifications for 15-30 minutes before</li></ol><h2>Better Solution: Use Our Web Tool</h2><p>While phone reminders work, our <a href="/">specialized plant watering tool</a> offers:</p><ul><li>Plant-specific schedules</li><li>Email reminders that do not get lost</li><li>No app installation required</li><li>Works on all devices</li></ul>',
  'Learn how to set up plant watering reminders on iPhone and Android with step-by-step instructions.',
  '/placeholder.svg',
  'Phone with plant reminder app notification'
),
(
  'easiest-indoor-plants-beginners',
  'Top 10 Easiest Indoor Plants to Take Care Of',
  '10 Easiest Indoor Plants for Beginners - Low Maintenance Guide',
  'Discover the 10 easiest indoor plants perfect for beginners. Low-maintenance options with simple watering schedules.',
  '<h1>Top 10 Easiest Indoor Plants to Take Care Of</h1><p>Starting your plant journey? These low-maintenance plants are perfect for beginners and nearly impossible to kill with proper care.</p><h2>1. Snake Plant (Sansevieria)</h2><p><strong>Watering:</strong> Every 2-3 weeks<br><strong>Light:</strong> Low to bright indirect light<br><strong>Why it is easy:</strong> Tolerates neglect and low light</p><h2>2. ZZ Plant (Zamioculcas zamiifolia)</h2><p><strong>Watering:</strong> Every 2-3 weeks<br><strong>Light:</strong> Low to moderate light<br><strong>Why it is easy:</strong> Extremely drought tolerant</p><h2>3. Pothos</h2><p><strong>Watering:</strong> Weekly<br><strong>Light:</strong> Low to bright indirect light<br><strong>Why it is easy:</strong> Fast growing and forgiving</p><h2>4. Spider Plant</h2><p><strong>Watering:</strong> Weekly<br><strong>Light:</strong> Bright, indirect light<br><strong>Why it is easy:</strong> Produces baby plants and recovers quickly</p><h2>5. Rubber Plant</h2><p><strong>Watering:</strong> Every 1-2 weeks<br><strong>Light:</strong> Bright, indirect light<br><strong>Why it is easy:</strong> Glossy leaves show when it needs water</p><p>Track all your plants easily with our <a href="/">free plant watering reminder tool</a> - perfect for beginners!</p>',
  'Discover the 10 easiest indoor plants for beginners with simple care instructions and watering schedules.',
  '/placeholder.svg',
  'Collection of easy care indoor plants'
),
(
  'summer-plant-watering-schedule',
  'Plant Watering During Summer: Adjusting Your Schedule',
  'Summer Plant Watering Guide - Adjust Your Schedule for Heat',
  'Learn how to adjust your plant watering schedule for summer heat. Keep plants healthy during hot weather.',
  '<h1>Plant Watering During Summer: Adjusting Your Schedule</h1><p>Summer heat changes everything about plant care. Higher temperatures and increased evaporation mean your watering schedule needs adjustment.</p><h2>How Summer Affects Plants</h2><ul><li><strong>Increased water loss:</strong> Plants lose more water through leaves</li><li><strong>Faster soil drying:</strong> Heat evaporates soil moisture quickly</li><li><strong>Active growth:</strong> Most plants grow more in summer</li><li><strong>Stress factors:</strong> Heat can stress plants if not watered properly</li></ul><h2>Summer Watering Adjustments</h2><h3>Indoor Plants</h3><ul><li>Increase frequency by 25-50%</li><li>Check soil moisture more often</li><li>Water early morning or evening</li><li>Increase humidity around plants</li></ul><h3>Outdoor Plants</h3><ul><li>Water deeply but less frequently</li><li>Early morning watering is best</li><li>Mulch to retain moisture</li><li>Check daily during heat waves</li></ul><h2>Stay on Track This Summer</h2><p>Do not let the heat stress your plants! Use our <a href="/">plant watering reminder tool</a> to adjust your schedules for summer and keep your plants thriving through the hot months.</p>',
  'Learn how to adjust your plant watering schedule for summer heat and keep your plants healthy during hot weather.',
  '/placeholder.svg',
  'Summer plant care with watering can illustration'
),
(
  'how-to-tell-plant-needs-water',
  'How to Tell If Your Plant Needs Water (Without Guessing)',
  'Signs Your Plant Needs Water - Stop Guessing, Start Knowing',
  'Learn the definitive signs that your plant needs water. Stop guessing and start reading your plants signals correctly.',
  '<h1>How to Tell If Your Plant Needs Water (Without Guessing)</h1><p>Stop playing the guessing game with plant watering! Learn to read the clear signals your plants give you about their water needs.</p><h2>The Finger Test (Most Reliable)</h2><p>Stick your finger 1-2 inches into the soil:</p><ul><li><strong>Dry:</strong> Time to water</li><li><strong>Slightly moist:</strong> Wait a day or two</li><li><strong>Wet:</strong> Do not water yet</li></ul><h2>Visual Cues</h2><h3>Leaves</h3><ul><li><strong>Slightly droopy:</strong> Needs water soon</li><li><strong>Wilted:</strong> Needs water now</li><li><strong>Yellowing lower leaves:</strong> Possible overwatering</li><li><strong>Crispy edges:</strong> Underwatering or low humidity</li></ul><h3>Soil</h3><ul><li><strong>Pulling away from pot:</strong> Very dry, water immediately</li><li><strong>Light colored:</strong> Usually indicates dryness</li><li><strong>Cracked surface:</strong> Definitely needs water</li></ul><h2>Weight Test</h2><p>Lift your pot - a light pot usually means dry soil. Heavy pots indicate moist soil.</p><h2>Never Guess Again</h2><p>Take the guesswork out of plant care with our <a href="/">plant watering reminder tool</a>. Set schedules based on each plant needs and get reminders when it is time to check your plants!</p>',
  'Learn the definitive signs that your plant needs water and stop the guessing game once and for all.',
  '/placeholder.svg',
  'Plant showing signs it needs water illustration'
),
(
  'science-of-watering-plants',
  'The Science of Watering Plants: Roots, Soil & Drainage',
  'Plant Watering Science - Understanding Roots, Soil & Water',
  'Understand the science behind plant watering. Learn how roots, soil, and drainage work together for healthy plants.',
  '<h1>The Science of Watering Plants: Roots, Soil & Drainage</h1><p>Understanding the science behind watering helps you become a better plant parent. Let us explore how water moves through the plant system.</p><h2>How Plant Roots Work</h2><p>Plant roots have two main functions:</p><ul><li><strong>Water absorption:</strong> Root hairs absorb water and dissolved nutrients</li><li><strong>Oxygen uptake:</strong> Roots need oxygen to function properly</li><li><strong>Anchoring:</strong> Roots keep the plant stable</li></ul><h2>The Role of Soil</h2><h3>Good Soil Provides:</h3><ul><li><strong>Water retention:</strong> Holds moisture for plant use</li><li><strong>Drainage:</strong> Allows excess water to escape</li><li><strong>Air pockets:</strong> Provides oxygen to roots</li><li><strong>Nutrients:</strong> Supplies essential minerals</li></ul><h2>Why Drainage Matters</h2><p>Proper drainage prevents:</p><ul><li>Root rot from waterlogged conditions</li><li>Fungal infections in soggy soil</li><li>Nutrient deficiencies from poor root function</li><li>Plant death from lack of oxygen</li></ul><h2>The Water Cycle in Plants</h2><ol><li>Roots absorb water from soil</li><li>Water travels up through the stem</li><li>Leaves use water for photosynthesis</li><li>Excess water evaporates through leaf pores</li></ol><h2>Apply Science to Your Care Routine</h2><p>Use our <a href="/">plant watering reminder tool</a> to apply scientific principles to your plant care. Set appropriate schedules that consider each plant unique water and drainage needs!</p>',
  'Understand the science behind plant watering including how roots, soil, and drainage work together for plant health.',
  '/placeholder.svg',
  'Plant root system and water absorption diagram'
);

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_settings (only admins can access)
CREATE POLICY "Only admins can access admin_settings" ON admin_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create policy for blog_posts (public read access)
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (published = true);
