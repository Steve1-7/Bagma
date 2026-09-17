-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'staff', 'manager', 'super_admin');
CREATE TYPE order_status AS ENUM ('received', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE order_type AS ENUM ('delivery', 'collection');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'arrived', 'in_progress', 'completed', 'cancelled');
CREATE TYPE gallery_category AS ENUM ('food', 'carwash', 'venue', 'events', 'lifestyle');
CREATE TYPE notification_type AS ENUM ('order', 'booking', 'promotion', 'system');
CREATE TYPE loyalty_transaction_type AS ENUM ('order', 'booking', 'promotion', 'manual', 'redemption');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Menu categories
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Menu items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  promotional_price DECIMAL(10, 2),
  dietary_info TEXT[],
  preparation_notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Menu item extras
CREATE TABLE menu_item_extras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_address TEXT,
  delivery_instructions TEXT,
  order_type order_type DEFAULT 'collection',
  status order_status DEFAULT 'received',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  order_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  extras JSONB,
  notes TEXT
);

-- Order status history
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Carwash vehicle types
CREATE TABLE carwash_vehicle_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_price_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Carwash services
CREATE TABLE carwash_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Carwash add-ons
CREATE TABLE carwash_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Carwash bookings
CREATE TABLE carwash_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  vehicle_type_id UUID REFERENCES carwash_vehicle_types(id) ON DELETE SET NULL,
  service_id UUID REFERENCES carwash_services(id) ON DELETE SET NULL,
  addons JSONB,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Booking status history
CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES carwash_bookings(id) ON DELETE CASCADE,
  status booking_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Time slots
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  interval_minutes INTEGER NOT NULL DEFAULT 30,
  active BOOLEAN DEFAULT true
);

-- Blocked dates
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  entertainment TEXT,
  rsvp_link TEXT,
  ticket_link TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Promotions
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10, 2),
  discount_percentage INTEGER,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  photo_url TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Gallery items
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category gallery_category NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Loyalty accounts
CREATE TABLE loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  points_balance INTEGER DEFAULT 0,
  total_points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Loyalty transactions
CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loyalty_account_id UUID REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  reference_type loyalty_transaction_type NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Site settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Contact messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(available) WHERE available = true;
CREATE INDEX idx_menu_items_featured ON menu_items(featured) WHERE featured = true;
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_carwash_bookings_user ON carwash_bookings(user_id);
CREATE INDEX idx_carwash_bookings_status ON carwash_bookings(status);
CREATE INDEX idx_carwash_bookings_date ON carwash_bookings(booking_date);
CREATE INDEX idx_events_published ON events(published) WHERE published = true;
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_promotions_active ON promotions(active) WHERE active = true;
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_reviews_approved ON reviews(approved) WHERE approved = true;
CREATE INDEX idx_gallery_category ON gallery_items(category);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read) WHERE read = false;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carwash_bookings_updated_at BEFORE UPDATE ON carwash_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_accounts_updated_at BEFORE UPDATE ON loyalty_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('business_name', 'Bagma Lifestyle', 'Business name'),
  ('business_phone', '+27XXXXXXXXX', 'Business phone number'),
  ('business_email', 'info@bagma.co.za', 'Business email address'),
  ('business_address', '123 Main Street, City, South Africa', 'Business physical address'),
  ('whatsapp_number', '+27XXXXXXXXX', 'WhatsApp business number'),
  ('instagram_url', 'https://instagram.com/bagma', 'Instagram profile URL'),
  ('facebook_url', 'https://facebook.com/bagma', 'Facebook page URL'),
  ('tiktok_url', 'https://tiktok.com/@bagma', 'TikTok profile URL'),
  ('opening_hours', 'Mon - Sun: 9:00 AM - 9:00 PM', 'Business opening hours'),
  ('delivery_fee', '50', 'Default delivery fee in ZAR'),
  ('delivery_partner_url', '', 'External delivery partner URL'),
  ('payment_provider', 'payfast', 'Payment provider (payfast, yoco, peach)'),
  ('google_maps_api_key', '', 'Google Maps API key'),
  ('google_analytics_id', '', 'Google Analytics tracking ID');

-- Insert default menu categories
INSERT INTO menu_categories (name, description, sort_order) VALUES
  ('Meat', 'Quality meat dishes', 1),
  ('Braai', 'Traditional braai specials', 2),
  ('Chicken', 'Chicken dishes', 3),
  ('Beef', 'Beef dishes', 4),
  ('Pork', 'Pork dishes', 5),
  ('Sides', 'Side dishes', 6),
  ('Platters', 'Sharing platters', 7),
  ('Burgers', 'Burger options', 8),
  ('Drinks', 'Beverages', 9),
  ('Specials', 'Daily specials', 10),
  ('Combos', 'Combo meals', 11);

-- Insert default carwash vehicle types
INSERT INTO carwash_vehicle_types (name, description, base_price_multiplier, sort_order) VALUES
  ('Small Car', 'Compact vehicles', 1.0, 1),
  ('Sedan', 'Standard sedans', 1.2, 2),
  ('SUV', 'Sport utility vehicles', 1.5, 3),
  ('Bakkie', 'Pickup trucks', 1.4, 4),
  ('Minibus', 'Large passenger vehicles', 1.8, 5),
  ('Other', 'Other vehicle types', 1.3, 6);

-- Insert default carwash services
INSERT INTO carwash_services (name, description, base_price, duration_minutes, sort_order) VALUES
  ('Basic Wash', 'Exterior wash and dry', 100, 30, 1),
  ('Premium Wash', 'Exterior wash, wax, and tire shine', 180, 45, 2),
  ('Full Valet', 'Complete interior and exterior cleaning', 350, 90, 3),
  ('Interior Clean', 'Interior vacuum and wipe down', 200, 60, 4),
  ('Exterior Detail', 'Detailed exterior cleaning and polish', 280, 75, 5),
  ('Deep Clean', 'Intensive interior and exterior detailing', 450, 120, 6);

-- Insert default carwash add-ons
INSERT INTO carwash_addons (name, description, price, sort_order) VALUES
  ('Tyre Shine', 'Premium tyre shine application', 30, 1),
  ('Interior Vacuum', 'Thorough interior vacuuming', 50, 2),
  ('Dashboard Treatment', 'Dashboard cleaning and conditioning', 40, 3),
  ('Wax', 'Premium wax application', 60, 4),
  ('Upholstery Cleaning', 'Fabric upholstery cleaning', 80, 5),
  ('Engine Bay Cleaning', 'Engine bay cleaning and dressing', 70, 6);

-- Insert default time slots (Mon-Sun, 9AM-6PM, 30-minute intervals)
INSERT INTO time_slots (day_of_week, start_time, end_time, interval_minutes) VALUES
  (0, '09:00:00', '18:00:00', 30),
  (1, '09:00:00', '18:00:00', 30),
  (2, '09:00:00', '18:00:00', 30),
  (3, '09:00:00', '18:00:00', 30),
  (4, '09:00:00', '18:00:00', 30),
  (5, '09:00:00', '18:00:00', 30),
  (6, '09:00:00', '18:00:00', 30);
