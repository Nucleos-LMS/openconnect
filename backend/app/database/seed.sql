-- Create test users for different roles
INSERT INTO users (email, name, role) VALUES
('inmate@test.facility.com', 'Test Inmate', 'incarcerated'),
('family@test.facility.com', 'Test Family Member', 'family'),
('staff@test.facility.com', 'Test Staff Member', 'staff');

-- Create test facility
INSERT INTO facilities (name, settings) VALUES
('Test Facility', '{"recordingEnabled": true, "aiMonitoring": true}'::jsonb);
