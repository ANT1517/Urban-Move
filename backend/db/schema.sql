
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE buses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  price NUMERIC NOT NULL,
  total_seats INTEGER NOT NULL,
  booked_seats INTEGER[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  travel_date DATE NOT NULL
);


CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  seats INTEGER[] NOT NULL,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  passenger_email TEXT NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, price, total_seats, amenities, travel_date) VALUES 
('TSRTC Garuda Plus', 'Hyderabad', 'Vijayawada', '06:00 AM', '09:30 AM', 350, 40, ARRAY['AC', 'WiFi'], CURRENT_DATE),
('Kaveri Travels', 'Vijayawada', 'Hyderabad', '10:00 AM', '01:30 PM', 300, 40, ARRAY['AC'], CURRENT_DATE),
('Orange Tours', 'Hyderabad', 'Bangalore', '09:00 PM', '07:00 AM', 1200, 36, ARRAY['AC', 'Sleeper', 'Blanket'], CURRENT_DATE),
('Morning Star', 'Hyderabad', 'Warangal', '07:00 AM', '10:00 AM', 250, 42, ARRAY['AC', 'Water'], CURRENT_DATE);
