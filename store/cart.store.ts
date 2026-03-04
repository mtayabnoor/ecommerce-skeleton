import { create } from 'zustand';
import { CartItem } from '@/types';
import { persist } from 'zustand/middleware';
import currency from 'currency.js';
import { getOrCreateCartSessionId } from '@/lib/utils';
import { saveCart } from '@/lib/actions/cart.actions';

type CartState = {
  items: CartItem[];
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
};

function syncToDb(items: CartItem[]) {
  const sessionCartId = getOrCreateCartSessionId();
  saveCart(items, sessionCartId).catch((err) => console.error('Cart sync failed:', err));
}

export const useCart = create<CartState>()(
  persist(
    (set, get): CartState => ({
      items: [],

      setCart: (items) => set({ items }),

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);

        let newItems: CartItem[];
        if (existing) {
          newItems = get().items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          );
        } else {
          newItems = [...get().items, item];
        }

        set({ items: newItems });
        syncToDb(newItems);
      },

      removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.productId !== productId);
        set({ items: newItems });
        syncToDb(newItems);
      },

      updateItemQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const newItems = get().items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i,
        );
        set({ items: newItems });
        syncToDb(newItems);
      },

      clearCart: () => {
        set({ items: [] });
        syncToDb([]);
      },

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
