import { create } from 'zustand';
import { CartItem } from '@/types';
import { persist } from 'zustand/middleware';

type CartState = {
  items: CartItem[];
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

      // Add item to cart
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.productId === item.productId);

        if (existingItem) {
          // Increase quantity if item exists
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
      },

      // Remove item from cart
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      // Update quantity
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

      // Clear entire cart
      clearCart: () => set({ items: [] }),

      // Compute total price
      getTotal: () =>
        get().items.reduce(
          (acc: number, i: CartItem) => acc + Number(i.price) * Number(i.quantity),
          0,
        ),
    }),
    {
      name: 'cart-storage', // key in localStorage
    },
  ),
);
