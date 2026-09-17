import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@/types';

interface CartStore extends Cart {
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (orderType: 'delivery' | 'collection') => void;
  setDeliveryAddress: (address: string) => void;
  setDeliveryInstructions: (instructions: string) => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'collection',
      deliveryAddress: null,
      deliveryInstructions: null,

      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.menuItem.id === item.menuItem.id
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + item.quantity,
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, item] };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItem.id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.menuItem.id !== menuItemId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.menuItem.id === menuItemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          orderType: 'collection',
          deliveryAddress: null,
          deliveryInstructions: null,
        });
      },

      setOrderType: (orderType) => {
        set({ orderType });
      },

      setDeliveryAddress: (address) => {
        set({ deliveryAddress: address });
      },

      setDeliveryInstructions: (instructions) => {
        set({ deliveryInstructions: instructions });
      },

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          const itemPrice = item.menuItem.promotional_price || item.menuItem.price;
          const extrasPrice = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
          return total + (itemPrice + extrasPrice) * item.quantity;
        }, 0);
      },

      getDeliveryFee: () => {
        const state = get();
        if (state.orderType === 'collection') return 0;
        // TODO: Implement dynamic delivery fee calculation based on address
        return 50; // Placeholder delivery fee
      },

      getTotal: () => {
        const state = get();
        return state.getSubtotal() + state.getDeliveryFee();
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'bagma-cart-storage',
    }
  )
);
