-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE carwash_vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE carwash_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE carwash_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE carwash_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user has required role
CREATE OR REPLACE FUNCTION has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin or higher
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('manager', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is staff or higher
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('staff', 'manager', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "System can create profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Menu categories policies (public read, admin write)
CREATE POLICY "Public can view active menu categories"
  ON menu_categories FOR SELECT
  USING (active = true);

CREATE POLICY "Staff can view all menu categories"
  ON menu_categories FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage menu categories"
  ON menu_categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Menu items policies (public read active, admin write)
CREATE POLICY "Public can view available menu items"
  ON menu_items FOR SELECT
  USING (available = true);

CREATE POLICY "Staff can view all menu items"
  ON menu_items FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage menu items"
  ON menu_items FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Menu item extras policies
CREATE POLICY "Public can view available extras"
  ON menu_item_extras FOR SELECT
  USING (available = true);

CREATE POLICY "Staff can view all extras"
  ON menu_item_extras FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage extras"
  ON menu_item_extras FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Staff can update order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_staff())
  WITH CHECK (is_staff());

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR is_staff())
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can manage order items"
  ON order_items FOR ALL
  TO authenticated
  USING (is_staff())
  WITH CHECK (is_staff());

-- Order status history policies
CREATE POLICY "Users can view own order status history"
  ON order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND (orders.user_id = auth.uid() OR is_staff())
    )
  );

CREATE POLICY "Staff can create order status history"
  ON order_status_history FOR INSERT
  TO authenticated
  WITH CHECK (is_staff());

-- Carwash vehicle types policies (public read, admin write)
CREATE POLICY "Public can view active vehicle types"
  ON carwash_vehicle_types FOR SELECT
  USING (active = true);

CREATE POLICY "Staff can view all vehicle types"
  ON carwash_vehicle_types FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage vehicle types"
  ON carwash_vehicle_types FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Carwash services policies (public read, admin write)
CREATE POLICY "Public can view active services"
  ON carwash_services FOR SELECT
  USING (active = true);

CREATE POLICY "Staff can view all services"
  ON carwash_services FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage services"
  ON carwash_services FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Carwash add-ons policies (public read, admin write)
CREATE POLICY "Public can view active add-ons"
  ON carwash_addons FOR SELECT
  USING (active = true);

CREATE POLICY "Staff can view all add-ons"
  ON carwash_addons FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage add-ons"
  ON carwash_addons FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Carwash bookings policies
CREATE POLICY "Users can view own bookings"
  ON carwash_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all bookings"
  ON carwash_bookings FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Users can create own bookings"
  ON carwash_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Staff can update booking status"
  ON carwash_bookings FOR UPDATE
  TO authenticated
  USING (is_staff())
  WITH CHECK (is_staff());

-- Booking status history policies
CREATE POLICY "Users can view own booking status history"
  ON booking_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carwash_bookings
      WHERE carwash_bookings.id = booking_status_history.booking_id
      AND (carwash_bookings.user_id = auth.uid() OR is_staff())
    )
  );

CREATE POLICY "Staff can create booking status history"
  ON booking_status_history FOR INSERT
  TO authenticated
  WITH CHECK (is_staff());

-- Time slots policies (public read, admin write)
CREATE POLICY "Public can view active time slots"
  ON time_slots FOR SELECT
  USING (active = true);

CREATE POLICY "Staff can view all time slots"
  ON time_slots FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage time slots"
  ON time_slots FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Blocked dates policies (public read, admin write)
CREATE POLICY "Public can view blocked dates"
  ON blocked_dates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage blocked dates"
  ON blocked_dates FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Events policies (public read published, admin write)
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (published = true);

CREATE POLICY "Staff can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Promotions policies (public read active, admin write)
CREATE POLICY "Public can view active promotions"
  ON promotions FOR SELECT
  USING (
    active = true
    AND start_date <= CURRENT_DATE
    AND end_date >= CURRENT_DATE
  );

CREATE POLICY "Staff can view all promotions"
  ON promotions FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage promotions"
  ON promotions FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Reviews policies (public read approved, user create, admin approve)
CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT
  USING (approved = true);

CREATE POLICY "Staff can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can approve reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Gallery items policies (public read active, admin write)
CREATE POLICY "Public can view active gallery items"
  ON gallery_items FOR SELECT
  USING (active = true);

CREATE POLICY "Staff can view all gallery items"
  ON gallery_items FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Admins can manage gallery items"
  ON gallery_items FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Loyalty accounts policies
CREATE POLICY "Users can view own loyalty account"
  ON loyalty_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all loyalty accounts"
  ON loyalty_accounts FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "System can create loyalty account"
  ON loyalty_accounts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update loyalty account"
  ON loyalty_accounts FOR UPDATE
  TO authenticated
  WITH CHECK (true);

-- Loyalty transactions policies
CREATE POLICY "Users can view own loyalty transactions"
  ON loyalty_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loyalty_accounts
      WHERE loyalty_accounts.id = loyalty_transactions.loyalty_account_id
      AND loyalty_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all loyalty transactions"
  ON loyalty_transactions FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "System can create loyalty transactions"
  ON loyalty_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Site settings policies (public read, admin write)
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Contact messages policies
CREATE POLICY "Staff can view all contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Public can create contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (is_staff())
  WITH CHECK (is_staff());
