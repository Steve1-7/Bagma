'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle, Ticket } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { notifyWhatsApp } from '@/lib/notify-whatsapp';

export default function TicketPurchase({ eventId, eventTitle, ticketPrice, ticketCapacity, ticketsSold }: { eventId: string; eventTitle: string; ticketPrice: number; ticketCapacity: number | null; ticketsSold: number }) {
  const { success, error } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', quantity: '1' });
  const [saving, setSaving] = useState(false);
  const remaining = ticketCapacity === null ? null : Math.max(ticketCapacity - ticketsSold, 0);
  const soldOut = remaining === 0;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(form.quantity);
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !Number.isInteger(quantity) || quantity < 1 || quantity > 20 || (remaining !== null && quantity > remaining)) {
      error('Enter your details and choose an available ticket quantity.');
      return;
    }
    setSaving(true);
    const ticketSummary = `${eventTitle} · ${quantity} ticket${quantity > 1 ? 's' : ''}`;
    const { error: insertError } = await createClient().from('event_ticket_orders').insert({ event_id: eventId, customer_name: form.name.trim(), customer_email: form.email.trim(), customer_phone: form.phone.trim(), quantity, unit_price: ticketPrice, total: ticketPrice * quantity, order_description: ticketSummary });
    setSaving(false);
    if (insertError) {
      error(insertError.message);
      return;
    }
    success('Ticket request received. Bagma will confirm payment and your tickets.');
    await notifyWhatsApp('ticket', { event: eventTitle, customer: form.name.trim(), phone: form.phone.trim(), quantity, total: (ticketPrice * quantity).toFixed(2) });
    setForm({ name: '', email: '', phone: '', quantity: '1' });
  }

  return <div className="border border-gold/30 bg-gold/5 p-6"><div className="flex items-center gap-3"><Ticket className="h-6 w-6 text-gold" /><div><h2 className="text-xl font-bold text-white">Buy tickets for {eventTitle}</h2><p className="text-sm text-white/60">{ticketPrice > 0 ? `R${ticketPrice.toFixed(2)} per ticket` : 'Ticket price available on request'}</p></div></div>{ticketCapacity !== null && <p className="mt-3 text-sm text-white/55">{remaining} of {ticketCapacity} tickets remaining</p>}{soldOut ? <p className="mt-5 flex items-center gap-2 text-red"><CheckCircle className="h-5 w-5" />This event is sold out.</p> : <form onSubmit={submit} className="mt-5 space-y-3"><Input required placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><Input required type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><Input required type="tel" placeholder="Phone number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /><label className="block text-sm text-white/70">Tickets<Input required type="number" min="1" max={remaining === null ? 20 : Math.min(20, remaining)} value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /></label><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Submitting...' : `Request ${form.quantity} ticket${form.quantity === '1' ? '' : 's'}`}</Button><p className="text-xs leading-relaxed text-white/45">Your request is recorded for admin confirmation. Payment instructions will be sent by Bagma.</p></form>}</div>;
}
