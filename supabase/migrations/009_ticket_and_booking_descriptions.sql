-- Ensure every order type stores a readable summary and that ticket statuses match the admin workflow.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_description TEXT;

ALTER TABLE carwash_bookings
  ADD COLUMN IF NOT EXISTS booking_description TEXT;

ALTER TABLE event_ticket_orders
  ADD COLUMN IF NOT EXISTS order_description TEXT,
  ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2);

ALTER TABLE event_ticket_orders
  DROP CONSTRAINT IF EXISTS event_ticket_orders_status_check;

ALTER TABLE event_ticket_orders
  ADD CONSTRAINT event_ticket_orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));
