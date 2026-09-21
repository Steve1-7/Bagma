'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, MapPin, Package, Truck } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

type OrderRecord = {
  id: string;
  status: 'received' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  order_type: 'delivery' | 'collection';
  delivery_address: string | null;
  delivery_instructions: string | null;
  order_description: string | null;
  total: number;
  created_at: string;
};

const statusSteps = [
  { key: 'received', label: 'Order Received', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Being Prepared', icon: Clock },
  { key: 'ready', label: 'Ready', icon: CheckCircle },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
] as const;

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen px-4 py-12 text-white/70">Loading order tracker...</div>}>
      <TrackOrderPageInner />
    </Suspense>
  );
}

function TrackOrderPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderQuery = searchParams.get('order') ?? '';
  const [manualOrderId, setManualOrderId] = useState(orderQuery);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(orderQuery));
  const [errorMessage, setErrorMessage] = useState('');

  const loadOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await createClient()
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !data) {
      setOrder(null);
      setErrorMessage('We could not find an order with that reference. Please check the ID or place a fresh order.');
      setLoading(false);
      return;
    }

    setOrder(data as OrderRecord);
    setLoading(false);
  }, []);

  useEffect(() => {
    const orderId = searchParams.get('order');
    if (!orderId) {
      return;
    }

    queueMicrotask(() => {
      void loadOrder(orderId);
    });
  }, [loadOrder, searchParams]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = manualOrderId.trim();

    if (!trimmed) {
      setErrorMessage('Please enter your order reference.');
      return;
    }

    router.push(`/track-order?order=${encodeURIComponent(trimmed)}`);
  };

  const currentStatus = order?.status ?? 'received';
  const currentStepIndex = Math.max(statusSteps.findIndex((step) => step.key === currentStatus), 0);
  const orderTypeLabel = order?.order_type === 'delivery' ? 'Delivery' : order?.order_type === 'collection' ? 'Collection' : 'Pending';

  const headlineMessage = useMemo(() => {
    if (!order) return 'Track your order in real time.';
    if (order.status === 'cancelled') return 'This order was cancelled.';
    if (order.order_type === 'delivery' && order.status === 'out_for_delivery') return 'Your order is on the way.';
    if (order.order_type === 'delivery' && order.status === 'delivered') return 'Your order has been delivered.';
    if (order.status === 'ready') return 'Your order is ready for collection.';
    return 'We are preparing your order now.';
  }, [order]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-white">Track Your Order</h1>

        {!order && !loading && (
          <Card className="mb-8 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Enter your order ID</h2>
            <p className="mb-6 text-sm text-white/60">
              Use the order reference from your confirmation message to track this delivery in real time.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
              <input
                value={manualOrderId}
                onChange={(event) => setManualOrderId(event.target.value)}
                placeholder="Order reference"
                className="flex-1 border border-white/15 bg-[#130d0b] px-4 py-3 text-white placeholder:text-white/35 focus:border-gold focus:outline-none"
              />
              <Button type="submit">Track order</Button>
            </form>
            {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}
          </Card>
        )}

        {loading && (
          <Card className="mb-8 p-6 text-white/70">
            Loading your order status...
          </Card>
        )}

        {errorMessage && order === null && !loading && (
          <Card className="mb-8 p-6 text-red-400">{errorMessage}</Card>
        )}

        {order && (
          <>
            <Card className="mb-8 p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-white/60">Order Number</div>
                  <div className="text-xl font-bold text-white">#{order.id.slice(0, 8)}</div>
                </div>
                <Badge variant={order.status === 'cancelled' ? 'danger' : 'success'} className="text-sm uppercase">
                  {order.status.replace(/_/g, ' ')}
                </Badge>
              </div>

              <p className="mb-6 text-base text-white/70">{headlineMessage}</p>

              {order.status !== 'cancelled' && (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-charcoal/50" />
                  <div className="space-y-8">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;

                      return (
                        <div key={step.key} className="relative flex items-start gap-4">
                          <div
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                              isCompleted ? 'bg-green-500' : isCurrent ? 'bg-red' : 'bg-charcoal'
                            }`}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 pt-1">
                            <div className={`font-medium ${isCurrent ? 'text-white' : 'text-white/60'}`}>
                              {step.label}
                            </div>
                            {isCurrent && <div className="mt-1 text-sm text-white/40">In progress...</div>}
                            {isCompleted && !isCurrent && <div className="mt-1 text-sm text-green-500">Completed</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Order Details</h2>
              <div className="space-y-3 text-white/80">
                <div className="flex justify-between gap-4">
                  <span>Order Type</span>
                  <span className="text-right text-white">{orderTypeLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Placed At</span>
                  <span className="text-right text-white">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Estimated Status</span>
                  <span className="text-right text-white">{order.status === 'delivered' ? 'Completed' : order.status === 'cancelled' ? 'Cancelled' : 'In progress'}</span>
                </div>
                {order.delivery_address && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Delivery Address</span>
                    <span className="max-w-xs text-right text-white">{order.delivery_address}</span>
                  </div>
                )}
                {order.delivery_instructions && (
                  <div className="flex justify-between gap-4">
                    <span>Delivery Notes</span>
                    <span className="max-w-xs text-right text-white">{order.delivery_instructions}</span>
                  </div>
                )}
                {order.order_description && (
                  <div className="flex justify-between gap-4">
                    <span>Items</span>
                    <span className="max-w-xs text-right text-white">{order.order_description}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-charcoal/50 pt-6">
                <h3 className="mb-3 text-white">Order summary</h3>
                <div className="flex justify-between text-white/70">
                  <span>Total</span>
                  <span className="font-semibold text-white">R{Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </>
        )}

        <div className="mt-8 text-center">
          <p className="mb-4 text-white/60">Need help with your order?</p>
          <Button variant="outline" asChild>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
