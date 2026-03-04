import { create } from 'zustand';
import { CartItem } from '@/types';
import { persist } from 'zustand/middleware';
import currency from 'currency.js';

type CartState = {
  items: CartItem[];
  setCart: (items: CartItem[]) => void;
  getTotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get): CartState => ({
      items: [],
      setCart: (items) => set({ items }),
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
