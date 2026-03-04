import { create } from 'zustand';
import { CartItem } from '@/types';
import { persist } from 'zustand/middleware';
import currency from 'currency.js';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '@/lib/actions/cart.actions';

type CartState = {
  items: CartItem[];
  setCart: (items: CartItem[]) => void;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;
  remove: (productId: string) => void;
  getTotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get): CartState => ({
      items: [],
      setCart: (items) => set({ items }),

      increase: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }));
        increaseQuantity(productId);
      },

      decrease: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) return;

        if (item.quantity <= 1) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          }));
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
            ),
          }));
        }
        decreaseQuantity(productId);
      },

      remove: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
        removeFromCart(productId);
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
