-- Allow the public booking flow to create appointments; staff/admins retain read and update access.
CREATE POLICY "Guests can create carwash bookings"
  ON carwash_bookings FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Guests can create booking history"
  ON booking_status_history FOR INSERT TO anon, authenticated
  WITH CHECK (true);