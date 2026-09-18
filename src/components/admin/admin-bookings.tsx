'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Booking = { id: string; customer_name: string; customer_phone: string; customer_email: string; booking_date: string; booking_time: string; status: string; total_price: number; notes: string | null; booking_description: string | null; vehicle?: { name: string }[] | null; service?: { name: string }[] | null };
const statuses = ['pending', 'confirmed', 'arrived', 'in_progress', 'completed', 'cancelled'];

export default function AdminBookings({ initialBookings }: { initialBookings: Booking[] }) {
  const { success, error } = useToast();
  const [bookings, setBookings] = useState(initialBookings);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const result = await createClient().from('carwash_bookings').update({ status }).eq('id', id);
    setUpdating(null);
    if (result.error) return error(result.error.message);
    setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status } : booking));
    success('Booking status updated.');
  }

  return <section className="mt-10 border-t border-white/10 pt-10"><div className="flex items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold"><CalendarDays className="h-4 w-4" /> Carwash</p><h2 className="mt-2 text-3xl font-black uppercase">All bookings</h2></div><span className="text-sm text-white/50">{bookings.length} total</span></div><div className="mt-6 grid gap-3">{bookings.length ? bookings.map((booking) => <article key={booking.id} className="border border-white/10 bg-charcoal/60 p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="font-bold">{booking.customer_name}</h3><p className="mt-1 text-sm text-white/60">{booking.booking_date} at {booking.booking_time} · {booking.vehicle?.[0]?.name || 'Vehicle'} · {booking.service?.[0]?.name || 'Service'}</p><p className="mt-1 text-sm text-gold">R{Number(booking.total_price).toFixed(2)} · {booking.customer_phone} · {booking.status}</p>{booking.booking_description && <p className="mt-2 text-sm text-white/45">{booking.booking_description}</p>}{booking.notes && <p className="mt-2 text-sm text-white/45">{booking.notes}</p>}</div><select aria-label={`Update booking status for ${booking.customer_name}`} value={booking.status} disabled={updating === booking.id} onChange={(event) => updateStatus(booking.id, event.target.value)} className="border border-white/15 bg-background px-3 py-2.5 text-white"><option value="">Status</option>{statuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></div></article>) : <p className="border border-dashed border-white/15 p-8 text-center text-white/50">No carwash bookings have been placed yet.</p>}</div></section>;
}
