'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { notifyWhatsApp } from '@/lib/notify-whatsapp';

const deliveryArea = 'Madabani, Western';
const uberEatsUrl = process.env.NEXT_PUBLIC_UBEREATS_URL || 'https://www.ubereats.com/';
const mrDUrl = process.env.NEXT_PUBLIC_MRD_URL || 'https://www.mrdfood.com/';

export default function CheckoutPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const {
    items,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    orderType,
    setDeliveryAddress,
    setDeliveryInstructions,
    clearCart,
  } = useCartStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    deliveryInstructions: '',
    orderNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderType === 'delivery' && !formData.deliveryAddress.trim()) {
      error('A delivery address is required for delivery orders.');
      return;
    }
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const subtotal = getSubtotal();
      const deliveryFee = orderType === 'collection' ? 0 : getDeliveryFee();
      const total = subtotal + deliveryFee;
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user?.id || null,
        customer_name: formData.fullName.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email.trim(),
        delivery_address: orderType === 'delivery' ? formData.deliveryAddress.trim() : null,
        delivery_instructions: orderType === 'delivery' ? formData.deliveryInstructions.trim() || null : null,
        order_type: orderType,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        order_notes: formData.orderNotes.trim() || null,
      }).select('id').single();
      if (orderError || !order) throw orderError || new Error('Order could not be created.');

      const { error: itemsError } = await supabase.from('order_items').insert(items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItem.id,
        quantity: item.quantity,
        unit_price: (item.menuItem.promotional_price || item.menuItem.price) + (item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0),
        extras: item.extras || null,
        notes: item.notes || null,
      })));
      if (itemsError) throw itemsError;
      await notifyWhatsApp('order', { id: order.id, customer: formData.fullName.trim(), phone: formData.phone.trim(), total: total.toFixed(2), type: orderType });

      // Update cart with delivery info
      if (orderType === 'delivery') {
        setDeliveryAddress(formData.deliveryAddress);
        setDeliveryInstructions(formData.deliveryInstructions);
      }

      success('Order placed successfully!');
      clearCart();
      router.push(`/order-confirmation?order=${order.id}`);
    } catch (submitError) {
      error(submitError instanceof Error ? submitError.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Delivery Information */}
            {orderType === 'delivery' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Delivery Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Delivery Address *
                    </label>
                    <Textarea
                      required
                      placeholder="House number, street and area"
                      rows={3}
                      value={formData.deliveryAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, deliveryAddress: e.target.value })
                      }
                    />
                    <p className="mt-2 text-xs text-white/50">Delivery area: {deliveryArea}</p>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Delivery Instructions
                    </label>
                    <Input
                      placeholder="e.g. Gate code, landmarks, etc."
                      value={formData.deliveryInstructions}
                      onChange={(e) =>
                        setFormData({ ...formData, deliveryInstructions: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Order Notes */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Order Notes</h2>
              <Textarea
                placeholder="Any special requests for your order?"
                rows={3}
                value={formData.orderNotes}
                onChange={(e) =>
                  setFormData({ ...formData, orderNotes: e.target.value })
                }
              />
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const itemPrice = item.menuItem.promotional_price || item.menuItem.price;
                  const extrasPrice = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
                  const unitPrice = itemPrice + extrasPrice;
                  const totalPrice = unitPrice * item.quantity;

                  return (
                    <div key={item.menuItem.id} className="flex justify-between text-sm">
                      <div className="text-white/80">
                        <span className="font-medium">{item.menuItem.name}</span>
                        <span className="text-white/60"> x{item.quantity}</span>
                      </div>
                      <span className="text-white">{formatPrice(totalPrice)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-charcoal/50 pt-6">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Delivery</span>
                  <span>{orderType === 'collection' ? 'Free' : formatPrice(getDeliveryFee())}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-charcoal/50">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-6"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Pay ${formatPrice(getTotal())}`}
              </Button>

              {orderType === 'delivery' && (
                <div className="mt-6 border-t border-charcoal/50 pt-6">
                  <p className="text-sm font-semibold text-white">Prefer a delivery partner?</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    Order from Bagma on your preferred service and use {deliveryArea} as the delivery location.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a href={uberEatsUrl} target="_blank" rel="noopener noreferrer" className="border border-white/15 px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-white hover:border-gold hover:text-gold">
                      Uber Eats
                    </a>
                    <a href={mrDUrl} target="_blank" rel="noopener noreferrer" className="border border-white/15 px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-white hover:border-gold hover:text-gold">
                      Mr D
                    </a>
                  </div>
                </div>
              )}

              <p className="text-white/40 text-xs text-center mt-4">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
