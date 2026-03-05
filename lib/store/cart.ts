// lib/store/cart.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import currency from 'currency.js';
import {
  addToCart,
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

// Store timers outside the store state so they don't trigger re-renders
const debounceTimers: Record<string, NodeJS.Timeout> = {};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
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
        const prevItems = get().cartItems;
        const existing = prevItems.find((i) => i.productId === item.productId);
        
        // 1. Instantly update UI (No throttling!)
        let updatedItems;
        if (existing) {
          const newQty = existing.quantity + item.quantity;
          if (newQty > item.stock) {
            import('sonner').then(({ toast }) => toast.error('Cannot exceed stock'));
            return;
          }
          updatedItems = prevItems.map((i) =>
            i.productId === item.productId ? { ...i, quantity: newQty } : i,
          );
        } else {
          if (item.quantity > item.stock) {
            import('sonner').then(({ toast }) => toast.error('Cannot exceed stock'));
            return;
          }
          updatedItems = [...prevItems, item];
        }

        set({ cartItems: updatedItems });

        // 2. Debounce the server call
        const timerKey = `add-${item.productId}`;
        if (debounceTimers[timerKey]) clearTimeout(debounceTimers[timerKey]);

        debounceTimers[timerKey] = setTimeout(async () => {
          try {
            const latestItemState = get().cartItems.find(i => i.productId === item.productId);
            if (!latestState) return;

            await addToCart(latestItemState);
            
          } catch (err) {
            console.error('Failed to add item to server cart', err);
            set({ cartItems: prevItems }); // Rollback to state before this burst of clicks
          }
        }, 500); // Wait 500ms after the last click to hit the server
      },

      updateQuantity: async (
        productId: string,
        quantity: number,
        variantId?: string | null,
      ) => {
        const prevItems = get().cartItems;
        const item = prevItems.find(
          (i) => i.productId === productId && (i.variantId || null) === (variantId || null),
        );
        if (!item) return;

        if (quantity < 1) {
          get().removeItem(productId, variantId);
          return;
        }

        if (quantity > item.stock) {
          import('sonner').then(({ toast }) => toast.error('Cannot exceed stock'));
          return;
        }

        // 1. Instantly update UI
        const updatedItems = prevItems.map((i) =>
          i.productId === productId && (i.variantId || null) === (variantId || null)
            ? { ...i, quantity }
            : i,
        );
        set({ cartItems: updatedItems });

        // 2. Debounce the server call
        const timerKey = `update-${productId}-${variantId || 'base'}`;
        if (debounceTimers[timerKey]) clearTimeout(debounceTimers[timerKey]);

        debounceTimers[timerKey] = setTimeout(async () => {
          try {
            const latestState = get().cartItems.find(
              (i) => i.productId === productId && (i.variantId || null) === (variantId || null)
            );
            if (!latestState) return;
            await updateCartItem(latestState.productId, latestState.quantity, latestState.variantId);
          } catch (err) {
            console.error('Failed to update quantity', err);
            set({ cartItems: prevItems }); // Rollback
          }
        }, 500);
      },

      removeItem: async (productId: string, variantId?: string | null) => {
        const prevItems = get().cartItems;
        const item = prevItems.find(
          (i) => i.productId === productId && (i.variantId || null) === (variantId || null),
        );
        if (!item) return;

        // 1. Instantly remove from UI
        set({
          cartItems: prevItems.filter(
            (i) => !(i.productId === productId && (i.variantId || null) === (variantId || null)),
          ),
        });

        // 2. Debounce the server call (less critical for removal, but prevents weird race conditions if they re-add quickly)
        const timerKey = `remove-${productId}-${variantId || 'base'}`;
        if (debounceTimers[timerKey]) clearTimeout(debounceTimers[timerKey]);

        debounceTimers[timerKey] = setTimeout(async () => {
          try {
            await removeFromCart(productId, variantId);
          } catch (err) {
            console.error('Failed to remove item', err);
            set({ cartItems: prevItems }); // Rollback
          }
        }, 300);
      },

      clearCart: () => set({ cartItems: [] }),

      totalAmount: () =>
        get().cartItems.reduce(
          (sum, item) => sum.add(currency(item.price).multiply(item.quantity)),
          currency(0),
        ).value,

      totalItems: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'cart-storage' },
  ),
);
