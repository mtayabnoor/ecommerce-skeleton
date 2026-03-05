'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/store/cart';
import { getCart, mergeGuestCart } from '@/lib/server-actions/actions/cart';
import { CartItem } from '@/types';
import { authClient } from '@/lib/auth-client';

export function CartInitializer() {
  const setCart = useCart((s) => s.setCart);
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  useEffect(() => {
    async function loadCart() {
      if (userId) await mergeGuestCart();
      const items = (await getCart())?.items as CartItem[];
      setCart(items);
    }

    loadCart();
  }, [setCart, userId]);

  return null;
}
