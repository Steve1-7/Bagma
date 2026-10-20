'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, BellOff, ClipboardList, Ticket } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

type OrderExtra = {
  name: string;
};

type OrderItem = {
  quantity: number;
  unit_price: number;
  extras: OrderExtra[] | null;
  notes: string | null;
  menu_item: { name: string }[] | null;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'delivery' | 'collection';
  status: string;
  total: number;
  delivery_address: string | null;
  delivery_instructions: string | null;
  order_notes: string | null;
  order_description: string | null;
  created_at: string;
  order_items: OrderItem[];
};

type TicketSale = {
  id: string;
  event_id: string;
  customer_name: string;
  customer_email: string;
  quantity: number;
  status: string;
  order_description: string | null;
  created_at: string;
  event?: { title: string }[] | null;
};

const orderStatuses = ['received', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
const ticketStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
const orderSelect = 'id, customer_name, customer_phone, order_type, status, total, delivery_address, delivery_instructions, order_notes, order_description, created_at, order_items(quantity, unit_price, extras, notes, menu_item:menu_items(name))';

function playOrderAlert(context: AudioContext | null) {
  if (!context || context.state !== 'running') return;

  const oscillator = context.createOscillator();
  const volume = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  volume.gain.setValueAtTime(0.18, context.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.45);
  oscillator.connect(volume);
  volume.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.45);
}

export default function AdminOrders({ orders, ticketSales }: { orders: Order[]; ticketSales: TicketSale[] }) {
  const { success, error: showError } = useToast();
  const [currentOrders, setCurrentOrders] = useState(orders);
  const [view, setView] = useState<'orders' | 'tickets'>('orders');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const knownOrderIds = useRef(new Set(orders.map((order) => order.id)));
  const audioContext = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(false);
  const ticketsSold = useMemo(
    () => ticketSales.filter((sale) => sale.status !== 'cancelled').reduce((total, sale) => total + sale.quantity, 0),
    [ticketSales],
  );

  useEffect(() => {
    let pollingErrorShown = false;

    async function refreshOrders() {
      const { data, error: refreshError } = await createClient()
        .from('orders')
        .select(orderSelect)
        .order('created_at', { ascending: false });

      if (refreshError) {
        console.error('Failed to refresh admin orders.', refreshError);
        if (!pollingErrorShown) showError('Could not check for new orders. The dashboard will keep retrying.');
        pollingErrorShown = true;
        return;
      }

      pollingErrorShown = false;
      const newOrders = data.filter((order) => !knownOrderIds.current.has(order.id));
      data.forEach((order) => knownOrderIds.current.add(order.id));
      setCurrentOrders(data);
      if (soundEnabledRef.current) newOrders.forEach(() => playOrderAlert(audioContext.current));
    }

    const interval = window.setInterval(() => void refreshOrders(), 15000);
    return () => window.clearInterval(interval);
  }, [showError]);

  async function toggleSoundAlerts() {
    if (soundEnabled) {
      soundEnabledRef.current = false;
      setSoundEnabled(false);
      return;
    }

    try {
      const context = audioContext.current ?? new AudioContext();
      audioContext.current = context;
      await context.resume();
      soundEnabledRef.current = true;
      setSoundEnabled(true);
    } catch (soundError) {
      console.error('Failed to enable order alert sound.', soundError);
      showError('Sound alerts could not be enabled in this browser.');
    }
  }

  async function updateOrderStatus(id: string, status: string) {
    setUpdatingOrderId(id);
    const { error: updateError } = await createClient().from('orders').update({ status }).eq('id', id);
    setUpdatingOrderId(null);
    if (updateError) return showError(updateError.message);
    setCurrentOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    success('Order status updated.');
  }

  async function updateTicketStatus(id: string, status: string) {
    setUpdatingTicketId(id);
    const { error: updateError } = await createClient().from('event_ticket_orders').update({ status }).eq('id', id);
    setUpdatingTicketId(null);
    if (updateError) return showError(updateError.message);
    success('Ticket request status updated.');
  }

  return (
    <section className="mt-10 border-t border-white/10 pt-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-white/10 bg-charcoal/60 p-5">
          <ClipboardList className="h-5 w-5 text-gold" />
          <p className="mt-5 text-3xl font-black">{currentOrders.length}</p>
          <p className="text-sm text-white/50">Food orders</p>
        </div>
        <div className="border border-white/10 bg-charcoal/60 p-5">
          <Ticket className="h-5 w-5 text-gold" />
          <p className="mt-5 text-3xl font-black">{ticketsSold}</p>
          <p className="text-sm text-white/50">Tickets sold/requested</p>
        </div>
        <div className="border border-white/10 bg-charcoal/60 p-5">
          <p className="text-3xl font-black">{currentOrders.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled').length}</p>
          <p className="mt-5 text-sm text-white/50">Open food orders</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => setView('orders')} className={`border px-4 py-2 text-sm font-bold ${view === 'orders' ? 'border-gold bg-gold text-black' : 'border-white/15 text-white/70'}`}>
            Food orders
          </button>
          <button type="button" onClick={() => setView('tickets')} className={`border px-4 py-2 text-sm font-bold ${view === 'tickets' ? 'border-gold bg-gold text-black' : 'border-white/15 text-white/70'}`}>
            Ticket sales
          </button>
        </div>
        {view === 'orders' && (
          <button
            type="button"
            onClick={() => void toggleSoundAlerts()}
            aria-pressed={soundEnabled}
            className="flex items-center gap-2 border border-white/15 px-4 py-2 text-sm font-bold text-white/80 transition-colors hover:border-gold hover:text-gold"
          >
            {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            {soundEnabled ? 'Sound alerts on' : 'Enable sound alerts'}
          </button>
        )}
      </div>

      {view === 'orders' ? (
        <div className="grid gap-3">
          {currentOrders.length ? currentOrders.map((order) => (
            <article key={order.id} className="border border-white/10 bg-charcoal/60 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold">#{order.id.slice(0, 8)} · {order.customer_name}</h3>
                  <p className="mt-1 text-sm text-white/50">{order.order_type} · R{Number(order.total).toFixed(2)}</p>
                  {order.order_items?.length ? (
                    <ul className="mt-3 space-y-2 text-sm text-white/75">
                      {order.order_items.map((item, index) => (
                        <li key={`${order.id}-${index}`}>
                          <span className="font-semibold">{item.menu_item?.[0]?.name || 'Menu item'}</span>
                          <span className="text-white/50"> × {item.quantity} · R{(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                          {item.extras?.length ? <p className="ml-2 text-xs text-white/45">Extras: {item.extras.map((extra) => extra.name).join(', ')}</p> : null}
                          {item.notes && <p className="ml-2 text-xs text-white/45">Item note: {item.notes}</p>}
                        </li>
                      ))}
                    </ul>
                  ) : order.order_description ? (
                    <p className="mt-2 text-sm text-white/60">{order.order_description}</p>
                  ) : null}
                  {order.order_notes && <p className="mt-2 text-sm text-white/60">Order note: {order.order_notes}</p>}
                  {order.delivery_address && <p className="mt-2 text-sm text-white/45">Deliver to: {order.delivery_address}</p>}
                  {order.delivery_instructions && <p className="mt-1 text-sm text-white/45">Delivery instructions: {order.delivery_instructions}</p>}
                </div>
                <select
                  aria-label={`Update order status for ${order.customer_name}`}
                  value={order.status}
                  disabled={updatingOrderId === order.id}
                  onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                  className="border border-white/15 bg-background px-3 py-2.5 text-white"
                >
                  <option value="">Status</option>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </article>
          )) : (
            <p className="border border-dashed border-white/15 p-8 text-center text-white/50">No food orders have been placed yet.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {ticketSales.length ? ticketSales.map((sale) => (
            <article key={sale.id} className="border border-white/10 bg-charcoal/60 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold">#{sale.id.slice(0, 8)} · {sale.customer_name}</h3>
                  <p className="mt-1 text-sm text-white/50">{sale.event?.[0]?.title || 'Event'} · {sale.quantity} ticket(s) · {sale.status}</p>
                  {sale.order_description && <p className="mt-2 text-sm text-white/60">{sale.order_description}</p>}
                </div>
                <select
                  aria-label={`Update ticket status for ${sale.customer_name}`}
                  value={sale.status}
                  disabled={updatingTicketId === sale.id}
                  onChange={(event) => updateTicketStatus(sale.id, event.target.value)}
                  className="border border-white/15 bg-background px-3 py-2.5 text-white"
                >
                  <option value="">Status</option>
                  {ticketStatuses.map((status) => (
                    <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </article>
          )) : (
            <p className="border border-dashed border-white/15 p-8 text-center text-white/50">No ticket sales have been recorded yet.</p>
          )}
        </div>
      )}
    </section>
  );
}
