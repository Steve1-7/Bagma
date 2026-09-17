-- Seed the initial customer-facing catalogue for the new Supabase project.
-- This migration only inserts missing records and does not remove existing data.

INSERT INTO menu_items (
  category_id,
  name,
  description,
  price,
  image_url,
  available,
  featured,
  sort_order
)
SELECT category.id, item.name, item.description, item.price, item.image_url, true, item.featured, item.sort_order
FROM (
  VALUES
    ('Meat', 'Braai Meat Platter', 'A generous selection of fire-grilled meat served hot and ready to share.', 180.00, '/images/papnbeef.jpg', true, 1),
    ('Pork', 'Grilled Pork', 'Tender, flame-grilled pork with a smoky Bagma finish.', 120.00, '/images/pork.jpg', true, 2),
    ('Meat', 'Wors', 'Traditional South African boerewors grilled over an open flame.', 85.00, '/images/wors.webp', true, 3),
    ('Chicken', 'Chicken Wings', 'Juicy grilled wings with your choice of our house seasoning.', 95.00, '/images/wings.jpeg', true, 4),
    ('Chicken', 'Kota Chicken', 'A loaded kota filled with seasoned chicken and classic toppings.', 75.00, '/images/kotachicken.jpg', true, 5),
    ('Drinks', 'Soft Drink', 'A cold soft drink to enjoy with your meal.', 25.00, '/images/placeholder-hero.jpg', false, 6)
) AS item(category_name, name, description, price, image_url, featured, sort_order)
JOIN menu_categories AS category ON category.name = item.category_name
WHERE NOT EXISTS (
  SELECT 1 FROM menu_items existing WHERE existing.name = item.name
);

INSERT INTO events (
  title,
  slug,
  description,
  image_url,
  event_date,
  event_time,
  location,
  entertainment,
  published
)
SELECT event.title, event.slug, event.description, event.image_url, event.event_date, event.event_time,
       event.location, event.entertainment, true
FROM (
  VALUES
    ('Spring Soccer Sunday', 'spring-soccer-sunday', 'Join us for live football, great food and a full day of Bagma energy.', '/images/soccer.jpg', DATE '2026-09-20', TIME '14:00', 'Bagma Lifestyle', 'Live soccer', true),
    ('October Lifestyle Weekend', 'october-lifestyle-weekend', 'Good food, music and a full lifestyle weekend at Bagma.', '/images/oct2026.jpg', DATE '2026-10-10', TIME '12:00', 'Bagma Lifestyle', 'Live entertainment', true),
    ('December Festive Braai', 'december-festive-braai', 'Celebrate the festive season with fire-grilled favourites and family entertainment.', '/images/dec2025.jpg', DATE '2026-12-12', TIME '12:00', 'Bagma Lifestyle', 'Live entertainment', true)
) AS event(title, slug, description, image_url, event_date, event_time, location, entertainment, published)
WHERE NOT EXISTS (
  SELECT 1 FROM events existing WHERE existing.slug = event.slug
);
