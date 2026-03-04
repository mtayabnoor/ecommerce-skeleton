'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/cart.store';
import { getCartItems } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';

export function CartInitializer() {
  const setCart = useCart((s) => s.setCart);

  useEffect(() => {
    async function loadCart() {
      const items = (await getCartItems()) as CartItem[];
      setCart(items);
    }

    loadCart();
  }, [setCart]);

  return null;
}
