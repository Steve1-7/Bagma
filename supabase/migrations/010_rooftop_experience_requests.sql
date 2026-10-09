-- Rooftop experience enquiry requests
CREATE TABLE IF NOT EXISTS rooftop_experience_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TIME,
  guest_count INTEGER,
  event_duration TEXT,
  seating_requirements TEXT,
  catering_requirements TEXT,
  decor_requirements TEXT,
  entertainment_requirements TEXT,
  equipment_requirements TEXT,
  special_requests TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  company_name TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'quoted', 'approved', 'declined', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE rooftop_experience_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can create rooftop experience requests"
  ON rooftop_experience_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view rooftop experience requests"
  ON rooftop_experience_requests FOR SELECT TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage rooftop experience requests"
  ON rooftop_experience_requests FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
