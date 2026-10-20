import { redirect } from 'next/navigation';
import { CalendarDays, Car, ClipboardList, Package, PartyPopper, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import AdminSignOut from '@/components/admin/admin-sign-out';
import AdminManagement from '@/components/admin/admin-management';
import AdminOrders from '@/components/admin/admin-orders';
import AdminBookings from '@/components/admin/admin-bookings';
import AdminCarwash from '@/components/admin/admin-carwash';
import AdminCustomers from '@/components/admin/admin-customers';
import AdminRooftop from '@/components/admin/admin-rooftop';

const dashboardLinks = [
  { label: 'Customers', detail: 'View customer profiles and activity', href: '#customers', icon: Users },
  { label: 'Orders', detail: 'Review food orders and ticket sales', href: '#orders', icon: ClipboardList },
  { label: 'Bookings', detail: 'Manage carwash appointments', href: '#bookings', icon: CalendarDays },
  { label: 'Rooftop', detail: 'Review experience requests', href: '#rooftop', icon: PartyPopper },
  { label: 'Carwash', detail: 'Manage services and add-ons', href: '#carwash', icon: Car },
  { label: 'Catalogue', detail: 'Update products, events and podcasts', href: '#catalogue', icon: Package },
];

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const [{ data: profile }, { data: categories }, { data: items }, { data: events }, { data: podcasts }, { data: orders }, { data: ticketSales }, { data: bookings }, { data: services }, { data: addons }, { data: customers }, { data: rooftopRequests }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('menu_categories').select('id, name, description, active, sort_order, parent_id').order('sort_order'),
    supabase.from('menu_items').select('id, category_id, name, description, price, promotional_price, available, featured, image_url, sort_order').order('sort_order'),
    supabase.from('events').select('*').order('event_date'),
    supabase.from('podcasts').select('*').order('published_at', { ascending: false }),
    supabase.from('orders').select('id, user_id, customer_name, customer_email, customer_phone, order_type, status, total, delivery_address, delivery_instructions, order_notes, order_description, created_at, order_items(quantity, unit_price, extras, notes, menu_item:menu_items(name))').order('created_at', { ascending: false }),
    supabase.from('event_ticket_orders').select('id, event_id, customer_name, customer_email, quantity, status, order_description, created_at, event:events(title)').order('created_at', { ascending: false }),
    supabase.from('carwash_bookings').select('id, customer_name, customer_phone, customer_email, booking_date, booking_time, status, total_price, booking_description, notes, vehicle:carwash_vehicle_types(name), service:carwash_services(name)').order('booking_date', { ascending: false }).order('booking_time', { ascending: false }),
    supabase.from('carwash_services').select('id, name, description, base_price, duration_minutes, active, featured, image_url').order('sort_order'),
    supabase.from('carwash_addons').select('id, name, description, price, active, image_url').order('sort_order'),
    supabase.from('profiles').select('id, full_name, first_name, last_name, email, phone, address, city, postal_code, country, is_active, created_at, last_activity').order('created_at', { ascending: false }),
    supabase.from('rooftop_experience_requests').select('*').order('created_at', { ascending: false }),
  ]);

  const customerOrderStats = orders ? orders.reduce<Record<string, { count: number; last_order_at: string | null }>>((acc, order) => {
    const key = order.user_id ?? order.customer_email ?? order.customer_phone;
    if (key) {
      acc[key] = {
        count: (acc[key]?.count ?? 0) + 1,
        last_order_at: order.created_at,
      };
    }
    return acc;
  }, {}) : {};

  const customerList = (customers || []).map((customer) => ({
    ...customer,
    orders_count: customerOrderStats[customer.id]?.count ?? 0,
    last_order_at: customerOrderStats[customer.id]?.last_order_at ?? null,
  }));

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Bagma operations</p>
            <h1 className="mt-3 text-6xl font-black uppercase leading-none">Dashboard</h1>
            <p className="mt-4 text-sm text-white/55">Welcome back, {profile?.full_name || user.email}.</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-gold">Bagma Lifestyle · 23°05&apos;57.1&quot;S 29°42&apos;42.0&quot;E</p>
          </div>
          <AdminSignOut />
        </header>

        <nav aria-label="Admin dashboard sections" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardLinks.map(({ label, detail, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="group border border-white/10 bg-charcoal/60 p-5 transition-colors hover:border-gold/60 hover:bg-charcoal"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black uppercase group-hover:text-gold">{label}</h2>
                  <p className="mt-1 text-sm text-white/50">{detail}</p>
                </div>
                <Icon className="h-6 w-6 shrink-0 text-gold" />
              </div>
            </a>
          ))}
        </nav>

        <div id="customers" className="scroll-mt-8">
          <AdminCustomers customers={customerList} />
        </div>
        <div id="orders" className="scroll-mt-8">
          <AdminOrders orders={orders || []} ticketSales={ticketSales || []} />
        </div>
        <div id="bookings" className="scroll-mt-8">
          <AdminBookings initialBookings={bookings || []} />
        </div>
        <div id="rooftop" className="scroll-mt-8">
          <AdminRooftop initialRequests={rooftopRequests || []} />
        </div>
        <div id="carwash" className="scroll-mt-8">
          <AdminCarwash initialServices={services || []} initialAddons={addons || []} />
        </div>

        <section id="catalogue" className="mt-14 scroll-mt-8 border-t border-white/10 pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold"><Package className="h-4 w-4" /> Catalogue</p>
              <h2 className="mt-3 text-4xl font-black uppercase">Products</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/55">Select a category to see its products, or choose all products to manage the full catalogue.</p>
            </div>
            <span className="hidden text-sm text-white/45 sm:block">{items?.length || 0} products</span>
          </div>

          <AdminManagement
            categories={categories || []}
            items={items || []}
            events={events || []}
            podcasts={podcasts || []}
          />
        </section>
      </div>
    </main>
  );
}