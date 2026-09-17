'use client';

import { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import type { MenuItem, MenuItemExtra, CartItem } from '@/types';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';

interface MenuItemCardProps {
  item: MenuItem;
  extras: MenuItemExtra[];
}

export default function MenuItemCard({ item, extras }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<MenuItemExtra[]>([]);
  const [notes, setNotes] = useState('');
  const { addItem } = useCartStore();
  const { success } = useToast();

  const toggleExtra = (extra: MenuItemExtra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      menuItem: item,
      quantity,
      extras: selectedExtras,
      notes: notes || null,
    };

    addItem(cartItem);
    success(`Added ${item.name} to cart`);

    // Reset form
    setQuantity(1);
    setSelectedExtras([]);
    setNotes('');
  };

  const basePrice = item.promotional_price || item.price;
  const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const totalPrice = (basePrice + extrasPrice) * quantity;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Customise Your Order</h3>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-white/80 text-sm font-medium mb-2">
          Quantity
        </label>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className="mb-6">
          <label className="block text-white/80 text-sm font-medium mb-3">
            Add Extras
          </label>
          <div className="space-y-2">
            {extras.map((extra) => {
              const isSelected = selectedExtras.find((e) => e.id === extra.id);
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-red bg-red/10'
                      : 'border-charcoal/50 hover:border-charcoal'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{extra.name}</div>
                      {extra.description && (
                        <div className="text-white/60 text-sm">
                          {extra.description}
                        </div>
                      )}
                    </div>
                    <div className="text-gold font-semibold">R{extra.price}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-white/80 text-sm font-medium mb-2">
          Special Instructions (Optional)
        </label>
        <Input
          placeholder="e.g. No onions, extra spicy, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Total and Add to Cart */}
      <div className="border-t border-charcoal/50 pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/80">Total</span>
          <span className="text-2xl font-bold text-gold">R{totalPrice}</span>
        </div>
        <Button size="lg" className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Order
        </Button>
      </div>
    </Card>
  );
}
