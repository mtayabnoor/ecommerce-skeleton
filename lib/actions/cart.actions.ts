'use server';

import { prisma } from '../prisma';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { CartItem } from '@/types';
import { formatError, convertPrismaObjectToJSON } from '../utils';
import currency from 'currency.js';

// Helper: get session userId (or null for guests)
async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

// Helper: compute cart prices from items
function calcPrices(items: CartItem[]) {
  const itemsPrice = items.reduce(
    (acc, i) => acc.add(currency(i.price).multiply(i.quantity)),
    currency(0),
  );
  const shippingPrice = currency(itemsPrice.value > 100 ? 0 : 10);
  const taxRate = currency(0.15);
  const taxPrice = itemsPrice.multiply(taxRate.value);
  const totalPrice = itemsPrice.add(shippingPrice).add(taxPrice);

  return {
    itemsPrice: itemsPrice.toString(),
    shippingPrice: shippingPrice.toString(),
    taxRate: taxRate.toString(),
    taxPrice: taxPrice.toString(),
    totalPrice: totalPrice.toString(),
  };
}

// Get cart by userId (logged in) or sessionCartId (guest)
export async function getCart(sessionCartId: string) {
  try {
    const userId = await getUserId();

    if (userId) {
      let cart = await prisma.cart.findFirst({ where: { userId } });

      if (!cart) {
        cart = await prisma.cart.findFirst({ where: { sessionCartId } });
        if (cart) {
          cart = await prisma.cart.update({
            where: { id: cart.id },
            data: { userId },
          });
        }
      }

      return convertPrismaObjectToJSON(cart);
    }

    const cart = await prisma.cart.findFirst({ where: { sessionCartId } });
    return convertPrismaObjectToJSON(cart);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function saveCart(items: CartItem[], sessionCartId: string) {
  try {
    const prices = calcPrices(items);

    const cart = await prisma.cart.findFirst({
      where: { sessionCartId },
    });

    if (items.length === 0 && cart) {
      await prisma.cart.delete({ where: { id: cart.id } });
      return { success: true, cart: null };
    }

    if (items.length === 0) {
      return { success: true, cart: null };
    }

    let result;
    if (cart) {
      result = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: items as CartItem[],
          ...prices,
        },
      });
    } else {
      result = await prisma.cart.create({
        data: {
          items: items as CartItem[],
          sessionCartId,
          ...prices,
        },
      });
    }

    return { success: true, cart: convertPrismaObjectToJSON(result) };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function syncCartToUser(sessionCartId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, message: 'Not authenticated' };

    const userCart = await prisma.cart.findFirst({ where: { userId } });
    const guestCart = await prisma.cart.findFirst({ where: { sessionCartId } });

    if (guestCart && userCart && guestCart.id !== userCart.id) {
      const userItems = userCart.items as CartItem[];
      const guestItems = guestCart.items as CartItem[];
      const merged = new Map<string, CartItem>();

      for (const item of userItems) merged.set(item.productId, { ...item });
      for (const item of guestItems) {
        const existing = merged.get(item.productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          merged.set(item.productId, { ...item });
        }
      }

      const mergedItems = Array.from(merged.values());
      const prices = calcPrices(mergedItems);

      await prisma.cart.update({
        where: { id: userCart.id },
        data: { items: mergedItems, sessionCartId, ...prices },
      });

      await prisma.cart.delete({ where: { id: guestCart.id } });
    } else if (guestCart && !userCart) {
      await prisma.cart.update({
        where: { id: guestCart.id },
        data: { userId },
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
