
-- Insert sample plant species data
INSERT INTO plant_species (name, scientific_name, watering_interval_days) VALUES 
('Snake Plant', 'Sansevieria trifasciata', 14),
('Pothos', 'Epipremnum aureum', 7),
('Peace Lily', 'Spathiphyllum wallisii', 5),
('Rubber Plant', 'Ficus elastica', 7),
('Spider Plant', 'Chlorophytum comosum', 5),
('ZZ Plant', 'Zamioculcas zamiifolia', 14),
('Monstera', 'Monstera deliciosa', 7),
('Fiddle Leaf Fig', 'Ficus lyrata', 7),
('Aloe Vera', 'Aloe barbadensis', 10),
('English Ivy', 'Hedera helix', 5),
('Philodendron', 'Philodendron hederaceum', 7),
('Boston Fern', 'Nephrolepis exaltata', 3),
('Dracaena', 'Dracaena marginata', 10),
('Jade Plant', 'Crassula ovata', 14),
('Bamboo Palm', 'Chamaedorea seifrizii', 5)
ON CONFLICT (id) DO NOTHING;
