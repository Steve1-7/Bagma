-- Rooftop posts for each occasion type (similar to events but for rooftop)
CREATE TABLE IF NOT EXISTS rooftop_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  occasion_type TEXT NOT NULL CHECK (occasion_type IN ('Business Meeting', 'Baby Shower', 'Birthday Party', 'Engagement Party', 'Anniversary', 'Private Celebration')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url TEXT,
  poster_url TEXT,
  ticket_price NUMERIC(10, 2),
  ticket_capacity INTEGER,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE rooftop_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published rooftop posts"
  ON rooftop_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Staff can view all rooftop posts"
  ON rooftop_posts FOR SELECT TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage rooftop posts"
  ON rooftop_posts FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE INDEX IF NOT EXISTS rooftop_posts_occasion_type_idx ON rooftop_posts(occasion_type);
CREATE INDEX IF NOT EXISTS rooftop_posts_published_idx ON rooftop_posts(published);
