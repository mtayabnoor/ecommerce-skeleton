import { create } from 'zustand';
import { CartItem } from '@/types';
import { persist } from 'zustand/middleware';
import currency from 'currency.js';
import { getOrCreateCartSessionId } from '@/lib/utils';
import { syncItemToDb } from '@/lib/actions/cart.actions';

type CartState = {
  items: CartItem[];
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get): CartState => ({
      items: [],

      setCart: (items) => set({ items }),

      addItem: async (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);

        const sessionCartId = getOrCreateCartSessionId();

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }

        try {
          await syncItemToDb(item, sessionCartId);
        } catch (error) {
          console.error('Failed to save item', error);
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateItemQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((acc, item) => {
          return acc.add(currency(item.price).multiply(item.quantity));
        }, currency(0)).value;
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
