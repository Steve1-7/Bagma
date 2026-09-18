'use client';

import { useMemo, useState } from 'react';
import { ClipboardList, Ticket } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'delivery' | 'collection';
  status: string;
  total: number;
  delivery_address: string | null;
  order_description: string | null;
  created_at: string;
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

export default function AdminOrders({ orders, ticketSales }: { orders: Order[]; ticketSales: TicketSale[] }) {
  const { success, error } = useToast();
  const [view, setView] = useState<'orders' | 'tickets'>('orders');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const ticketsSold = useMemo(
    () => ticketSales.filter((sale) => sale.status !== 'cancelled').reduce((total, sale) => total + sale.quantity, 0),
    [ticketSales],
  );

  async function updateOrderStatus(id: string, status: string) {
    setUpdatingOrderId(id);
    const { error: updateError } = await createClient().from('orders').update({ status }).eq('id', id);
    setUpdatingOrderId(null);
    if (updateError) return error(updateError.message);
    success('Order status updated.');
  }

  async function updateTicketStatus(id: string, status: string) {
    setUpdatingTicketId(id);
    const { error: updateError } = await createClient().from('event_ticket_orders').update({ status }).eq('id', id);
    setUpdatingTicketId(null);
    if (updateError) return error(updateError.message);
    success('Ticket request status updated.');
  }

  return (
    <section className="mt-10 border-t border-white/10 pt-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-white/10 bg-charcoal/60 p-5">
          <ClipboardList className="h-5 w-5 text-gold" />
          <p className="mt-5 text-3xl font-black">{orders.length}</p>
          <p className="text-sm text-white/50">Food orders</p>
        </div>
        <div className="border border-white/10 bg-charcoal/60 p-5">
          <Ticket className="h-5 w-5 text-gold" />
          <p className="mt-5 text-3xl font-black">{ticketsSold}</p>
          <p className="text-sm text-white/50">Tickets sold/requested</p>
        </div>
        <div className="border border-white/10 bg-charcoal/60 p-5">
          <p className="text-3xl font-black">{orders.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled').length}</p>
          <p className="mt-5 text-sm text-white/50">Open food orders</p>
        </div>
      </div>

      <div className="mt-8 flex gap-2 border-b border-white/10 pb-4">
        <button type="button" onClick={() => setView('orders')} className={`border px-4 py-2 text-sm font-bold ${view === 'orders' ? 'border-gold bg-gold text-black' : 'border-white/15 text-white/70'}`}>
          Food orders
        </button>
        <button type="button" onClick={() => setView('tickets')} className={`border px-4 py-2 text-sm font-bold ${view === 'tickets' ? 'border-gold bg-gold text-black' : 'border-white/15 text-white/70'}`}>
          Ticket sales
        </button>
      </div>

      {view === 'orders' ? (
        <div className="grid gap-3">
          {orders.length ? orders.map((order) => (
            <article key={order.id} className="border border-white/10 bg-charcoal/60 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold">#{order.id.slice(0, 8)} · {order.customer_name}</h3>
                  <p className="mt-1 text-sm text-white/50">{order.order_type} · R{Number(order.total).toFixed(2)}</p>
                  {order.order_description && <p className="mt-2 text-sm text-white/60">{order.order_description}</p>}
                  {order.delivery_address && <p className="mt-2 text-sm text-white/45">Deliver to: {order.delivery_address}</p>}
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
