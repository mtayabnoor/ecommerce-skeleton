// lib/store/cart.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import currency from 'currency.js';
import {
  updateCartItem,
  removeFromCart,
  mergeGuestCart,
} from '@/lib/server-actions/actions/cart';
import { CartItem } from '@/types';

interface CartState {
  cartItems: CartItem[];
  setCart: (items: CartItem[]) => void;
  mergeWithServerCart: (serverItems: CartItem[]) => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string | null,
  ) => Promise<void>;
  removeItem: (productId: string, variantId?: string | null) => Promise<void>;
  clearCart: () => void;
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => {
      // Track last action timestamps to throttle rapid clicks
      const lastActionTimestamps: Record<string, number> = {};

      const throttle = (key: string, delay = 300) => {
        const now = Date.now();
        if (lastActionTimestamps[key] && now - lastActionTimestamps[key] < delay)
          return false;
        lastActionTimestamps[key] = now;
        return true;
      };

      return {
        cartItems: [],

        setCart: (items: CartItem[]) => set({ cartItems: items }),

        mergeWithServerCart: async (serverItems: CartItem[]) => {
          const localItems = get().cartItems;
          const merged: CartItem[] = [...serverItems];

          localItems.forEach((localItem) => {
            const existing = merged.find((i) => i.productId === localItem.productId);
            if (existing) {
              existing.quantity += localItem.quantity;
            } else {
              merged.push(localItem);
            }
          });

          set({ cartItems: merged });

          try {
            await mergeGuestCart();
          } catch (err) {
            console.error('Failed to merge cart with server', err);
          }
        },

        addItem: async (item: CartItem) => {
          if (!throttle(`add-${item.productId}`)) return; // prevent spamming
          const prevItems = get().cartItems;
          const existing = prevItems.find((i) => i.productId === item.productId);

          let updatedItems;
          if (existing) {
            const newQty = existing.quantity + item.quantity;
            // Stock check
            if (newQty > item.stock) {
              console.warn('Cannot exceed stock limit');
              import('sonner').then(({ toast }) =>
                toast.error('Cannot exceed available stock'),
              );
              return;
            }
            updatedItems = prevItems.map((i) =>
              i.productId === item.productId ? { ...i, quantity: newQty } : i,
            );
          } else {
            if (item.quantity > item.stock) {
              console.warn('Cannot exceed stock limit');
              import('sonner').then(({ toast }) =>
                toast.error('Cannot exceed available stock'),
              );
              return;
            }
            updatedItems = [...prevItems, item];
          }

          set({ cartItems: updatedItems });

          try {
            await (await import('@/lib/server-actions/actions/cart')).addToCart(item);
          } catch (err) {
            console.error('Failed to add item to server cart', err);
            set({ cartItems: prevItems }); // rollback
          }
        },

        updateQuantity: async (
          productId: string,
          quantity: number,
          variantId?: string | null,
        ) => {
          const itemKey = `${productId}-${variantId || 'base'}`;
          if (!throttle(`update-${itemKey}`)) return; // throttle per item

          const prevItems = get().cartItems;
          const item = prevItems.find(
            (i) =>
              i.productId === productId && (i.variantId || null) === (variantId || null),
          );
          if (!item) return;

          // If quantity drops below 1, remove the item
          if (quantity < 1) {
            get().removeItem(productId, variantId);
            return;
          }

          // Optional: stock check
          if (quantity > item.stock) {
            console.warn('Cannot exceed stock limit');
            import('sonner').then(({ toast }) =>
              toast.error('Cannot exceed available stock'),
            );
            return;
          }

          // Optimistic update
          const updatedItems = prevItems.map((i) =>
            i.productId === productId && (i.variantId || null) === (variantId || null)
              ? { ...i, quantity }
              : i,
          );
          set({ cartItems: updatedItems });

          try {
            await updateCartItem(productId, quantity, variantId); // server call
          } catch (err) {
            console.error('Failed to update quantity', err);
            set({ cartItems: prevItems }); // rollback on failure
          }
        },

        removeItem: async (productId: string, variantId?: string | null) => {
          const itemKey = `${productId}-${variantId || 'base'}`;
          if (!throttle(`remove-${itemKey}`)) return;
          const prevItems = get().cartItems;
          const item = prevItems.find(
            (i) =>
              i.productId === productId && (i.variantId || null) === (variantId || null),
          );
          if (!item) return;

          set({
            cartItems: prevItems.filter(
              (i) =>
                !(
                  i.productId === productId &&
                  (i.variantId || null) === (variantId || null)
                ),
            ),
          });

          try {
            await removeFromCart(item);
          } catch (err) {
            console.error('Failed to remove item', err);
            set({ cartItems: prevItems }); // rollback
          }
        },

        clearCart: () => set({ cartItems: [] }),

        totalAmount: () =>
          get().cartItems.reduce(
            (sum, item) => sum.add(currency(item.price).multiply(item.quantity)),
            currency(0),
          ).value,

        totalItems: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    },
    { name: 'cart-storage' },
  ),
);
