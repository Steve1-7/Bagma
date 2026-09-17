'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    setOrderType,
    orderType,
  } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
          <p className="text-white/60 mb-6">
            Your cart is waiting for something delicious.
          </p>
          <Button size="lg" asChild>
            <Link href="/order">Browse Food</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = item.menuItem.promotional_price || item.menuItem.price;
              const extrasPrice = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
              const unitPrice = itemPrice + extrasPrice;
              const totalPrice = unitPrice * item.quantity;

              return (
                <Card key={item.menuItem.id} className="p-6">
                  <div className="flex gap-4">
                    {item.menuItem.image_url && (
                      <img
                        src={item.menuItem.image_url}
                        alt={item.menuItem.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {item.menuItem.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.menuItem.id)}
                          className="text-white/40 hover:text-red transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.extras && item.extras.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.extras.map((extra) => (
                            <Badge key={extra.id} variant="default" className="text-xs">
                              {extra.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-white/60 text-sm mb-3 italic">
                          &quot;{item.notes}&quot;
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-gold font-bold">{formatPrice(totalPrice)}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            <Button
              variant="ghost"
              className="text-red hover:text-red/80"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* Order Type */}
              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType('collection')}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      orderType === 'collection'
                        ? 'border-red bg-red/10 text-white'
                        : 'border-charcoal/50 text-white/60 hover:border-charcoal'
                    }`}
                  >
                    <div className="font-medium">Collection</div>
                    <div className="text-xs text-white/60">Pick up at Bagma</div>
                  </button>
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      orderType === 'delivery'
                        ? 'border-red bg-red/10 text-white'
                        : 'border-charcoal/50 text-white/60 hover:border-charcoal'
                    }`}
                  >
                    <div className="font-medium">Delivery</div>
                    <div className="text-xs text-white/60">To your door</div>
                  </button>
                </div>
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

              <Button size="lg" className="w-full mt-6" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button variant="outline" size="lg" className="w-full mt-3" asChild>
                <Link href="/order">Continue Shopping</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
