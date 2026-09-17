-- Add real event ticket sales and allow guest checkout while keeping reads private.
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS ticket_capacity INTEGER CHECK (ticket_capacity IS NULL OR ticket_capacity > 0);

CREATE TABLE IF NOT EXISTS event_ticket_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 20),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE event_ticket_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can create ticket orders"
  ON event_ticket_orders FOR INSERT TO anon, authenticated
  WITH CHECK (quantity > 0 AND quantity <= 20);

CREATE POLICY "Staff can view ticket orders"
  ON event_ticket_orders FOR SELECT TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage ticket orders"
  ON event_ticket_orders FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete ticket orders"
  ON event_ticket_orders FOR DELETE TO authenticated
  USING (is_admin());

CREATE OR REPLACE FUNCTION public.tickets_sold_for_event(target_event_id UUID)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(quantity), 0)::INTEGER
  FROM event_ticket_orders
  WHERE event_id = target_event_id AND status IN ('pending', 'confirmed');
$$;

GRANT EXECUTE ON FUNCTION public.tickets_sold_for_event(UUID) TO anon, authenticated;

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Guests and users can create orders"
  ON orders FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create order items" ON order_items;
CREATE POLICY "Guests and users can create order items"
  ON order_items FOR INSERT TO anon, authenticated
  WITH CHECK (true);