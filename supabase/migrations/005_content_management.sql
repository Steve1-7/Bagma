-- Extend the existing content model without replacing existing records.
ALTER TABLE menu_categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES menu_categories(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS menu_categories_parent_id_idx ON menu_categories(parent_id);

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'upcoming'
  CHECK (status IN ('upcoming', 'completed'));

CREATE TABLE IF NOT EXISTS podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  youtube_url TEXT NOT NULL,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  thumbnail_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published podcasts"
  ON podcasts FOR SELECT USING (published = true);

CREATE POLICY "Staff can view all podcasts"
  ON podcasts FOR SELECT TO authenticated USING (is_staff());

CREATE POLICY "Admins can manage podcasts"
  ON podcasts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Public media URLs are fine for published catalogue/content imagery; writes remain admin-only.
INSERT INTO storage.buckets (id, name, public)
VALUES ('bagma-media', 'bagma-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view Bagma media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bagma-media');

CREATE POLICY "Admins can upload Bagma media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'bagma-media' AND is_admin());

CREATE POLICY "Admins can update Bagma media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'bagma-media' AND is_admin())
  WITH CHECK (bucket_id = 'bagma-media' AND is_admin());

CREATE POLICY "Admins can delete Bagma media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'bagma-media' AND is_admin());

UPDATE events
SET status = CASE WHEN event_date < CURRENT_DATE THEN 'completed' ELSE 'upcoming' END
WHERE status = 'upcoming';