'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/cart.store';
import { getCartItems, syncCartToUser } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';
import { authClient } from '@/lib/auth-client';

export function CartInitializer() {
  const setCart = useCart((s) => s.setCart);
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  useEffect(() => {
    async function loadCart() {
      if (userId) await syncCartToUser(userId);
      const items = (await getCartItems()) as CartItem[];
      setCart(items);
    }

    loadCart();
  }, [setCart, userId]);

  return null;
}
