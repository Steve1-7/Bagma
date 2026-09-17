// Database Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'staff' | 'manager' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  active: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  promotional_price: number | null;
  dietary_info: string[] | null;
  preparation_notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItemExtra {
  id: string;
  menu_item_id: string;
  name: string;
  description: string | null;
  price: number;
  available: boolean;
  sort_order: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string | null;
  delivery_instructions: string | null;
  order_type: 'delivery' | 'collection';
  status: 'received' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  order_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  extras: MenuItemExtra[] | null;
  notes: string | null;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface CarwashVehicleType {
  id: string;
  name: string;
  description: string | null;
  base_price_multiplier: number;
  active: boolean;
  sort_order: number;
}

export interface CarwashService {
  id: string;
  name: string;
  description: string;
  base_price: number;
  duration_minutes: number;
  active: boolean;
  featured: boolean;
  sort_order: number;
}

export interface CarwashAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  sort_order: number;
}

export interface CarwashBooking {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  vehicle_type_id: string;
  service_id: string;
  addons: CarwashAddon[] | null;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  notes: string | null;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface BookingStatusHistory {
  id: string;
  booking_id: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  interval_minutes: number;
  active: boolean;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  event_date: string;
  event_time: string;
  location: string;
  entertainment: string | null;
  rsvp_link: string | null;
  ticket_link: string | null;
  published: boolean;
  status: 'upcoming' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  published_at: string;
  thumbnail_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  price: number | null;
  discount_percentage: number | null;
  start_date: string;
  end_date: string;
  cta_text: string | null;
  cta_link: string | null;
  active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string | null;
  customer_name: string;
  rating: number;
  review: string;
  photo_url: string | null;
  approved: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: 'food' | 'carwash' | 'venue' | 'events' | 'lifestyle';
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface LoyaltyAccount {
  id: string;
  user_id: string;
  points_balance: number;
  total_points_earned: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  loyalty_account_id: string;
  points: number;
  description: string;
  reference_type: 'order' | 'booking' | 'promotion' | 'manual' | 'redemption';
  reference_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  type: 'order' | 'booking' | 'promotion' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Cart Types
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  extras: MenuItemExtra[];
  notes: string | null;
}

export interface Cart {
  items: CartItem[];
  orderType: 'delivery' | 'collection';
  deliveryAddress: string | null;
  deliveryInstructions: string | null;
}

// UI Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
