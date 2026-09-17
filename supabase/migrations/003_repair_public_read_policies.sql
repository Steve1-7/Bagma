-- Repair public read access if the original RLS migration stopped early.
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active menu categories" ON menu_categories;
CREATE POLICY "Public can view active menu categories"
  ON menu_categories FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Public can view available menu items" ON menu_items;
CREATE POLICY "Public can view available menu items"
  ON menu_items FOR SELECT
  USING (available = true);

DROP POLICY IF EXISTS "Public can view available extras" ON menu_item_extras;
CREATE POLICY "Public can view available extras"
  ON menu_item_extras FOR SELECT
  USING (available = true);

DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (published = true);
