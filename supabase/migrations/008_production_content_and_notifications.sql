-- Production content is managed by admins. Do not rely on local asset fallbacks.
ALTER TABLE carwash_services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE carwash_addons ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE event_ticket_orders
  ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2);

UPDATE menu_items SET image_url = NULL WHERE image_url LIKE '/images/%';
UPDATE events SET image_url = NULL WHERE image_url LIKE '/images/%';
UPDATE carwash_services SET image_url = NULL WHERE image_url LIKE '/images/%';
UPDATE carwash_addons SET image_url = NULL WHERE image_url LIKE '/images/%';

-- Existing price values remain editable catalogue data; no frontend defaults are used.