'use client';

import { useEffect } from 'react';
import { getOrCreateCartSessionId } from '@/lib/utils';
import { syncCartToUser } from '@/lib/actions/cart.actions';
import { authClient } from '@/lib/auth-client';

function CartSyncOnLogin() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const sessionCartId = getOrCreateCartSessionId();
    syncCartToUser(sessionCartId).catch((e) => console.error('Cart sync failed:', e));
  }, [userId]);

  return null;
}

export { CartSyncOnLogin };
