'use client';

import { useEffect } from 'react';
import { getOrCreateCartSessionId } from '@/lib/utils';
import { syncCartToUser } from '@/lib/actions/cart.actions';

function CartSyncOnLogin() {
  useEffect(() => {
    async function syncCart() {
      const sessionCartId = getOrCreateCartSessionId();
      const res = await syncCartToUser(sessionCartId);
      console.log('res', res);
    }
    syncCart();
  }, []);

  return null;
}

export { CartSyncOnLogin };
