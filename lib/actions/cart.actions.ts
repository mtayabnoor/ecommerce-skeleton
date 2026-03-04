'use server';

import { prisma } from '../prisma';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { CartItem } from '@/types';
import { formatError, convertPrismaObjectToJSON } from '../utils';

export async function getCart(sessionCartId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (userId) {
      let cart = await prisma.cart.findFirst({
        where: { userId },
      });

      if (!cart) {
        cart = await prisma.cart.findFirst({
          where: { sessionCartId },
        });

        if (cart) {
          cart = await prisma.cart.update({
            where: { id: cart.id },
            data: { userId },
          });
        }
      }

      return convertPrismaObjectToJSON(cart);
    } else {
      // Guest: find by session ID
      const cart = await prisma.cart.findFirst({
        where: { sessionCartId },
      });
      return convertPrismaObjectToJSON(cart);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Link a guest cart to the authenticated user after sign-in
export async function syncCartToUser(sessionCartId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;

    if (!userId) return { success: false, message: 'Not authenticated' };

    // Check if user already has a cart
    const userCart = await prisma.cart.findFirst({ where: { userId } });
    const guestCart = await prisma.cart.findFirst({ where: { sessionCartId } });

    if (guestCart && userCart && guestCart.id !== userCart.id) {
      // Merge guest items into user cart
      const mergedItems = [
        ...(userCart.items as CartItem[]),
        ...(guestCart.items as CartItem[]),
      ];

      await prisma.cart.update({
        where: { id: userCart.id },
        data: { items: mergedItems, sessionCartId },
      });

      // Delete the guest cart
      await prisma.cart.delete({ where: { id: guestCart.id } });
    } else if (guestCart && !userCart) {
      // Just assign guest cart to user
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

export async function syncItemToDb(item: CartItem, sessionCartId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    if (cart) {
      // Update existing
      cart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: [...(cart.items as CartItem[]), item],
          sessionCartId,
          ...(userId ? { userId } : {}),
        },
      });
    } else {
      // Create new
      cart = await prisma.cart.create({
        data: {
          items: [item],
          sessionCartId,
          ...(userId ? { userId } : {}),
        },
      });
    }

    return { success: true, cart: convertPrismaObjectToJSON(cart) };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
