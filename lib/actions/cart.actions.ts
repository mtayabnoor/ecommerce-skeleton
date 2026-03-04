'use server';

import { prisma } from '../prisma';
import { getOrCreateCart } from '../cart';
import { CartItem } from '@/types';
import { convertPrismaObjectToJSON } from '../utils';

export async function addToCart(item: CartItem) {
  const cart = await getOrCreateCart();

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: item.productId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + item.quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
      },
    });
  }

  const updatedItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
  });

  return convertPrismaObjectToJSON(updatedItems);
}

export async function decreaseQuantity(productId: string) {
  const cart = await getOrCreateCart();

  const item = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (!item) return;

  if (item.quantity <= 1) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: item.quantity - 1 },
    });
  }
}

export async function increaseQuantity(productId: string) {
  const cart = await getOrCreateCart();

  const item = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (!item) return;

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: item.quantity + 1 },
  });
}

export async function removeFromCart(productId: string) {
  const cart = await getOrCreateCart();

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });
}

export async function getCartItems() {
  const cart = await getOrCreateCart();

  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
  });

  return convertPrismaObjectToJSON(cartItems);
}

export async function syncCartToUser(userId: string) {
  const cookieStore = await cookies();
  const guestCartId = cookieStore.get('cartId')?.value;

  if (!guestCartId) return;

  const guestCart = await prisma.cart.findUnique({
    where: { id: guestCartId },
    include: { cartItems: true },
  });

  // No guest cart or it's already owned by this user
  if (!guestCart || guestCart.userId === userId) return;

  // Check if user already has a cart from a previous session
  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { cartItems: true },
  });

  if (userCart && userCart.id !== guestCart.id) {
    // Merge guest items into existing user cart
    for (const guestItem of guestCart.cartItems) {
      const existing = userCart.cartItems.find(
        (i) => i.productId === guestItem.productId,
      );

      if (existing) {
        // Same product — sum quantities
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + guestItem.quantity },
        });
      } else {
        // New product — move to user cart
        await prisma.cartItem.update({
          where: { id: guestItem.id },
          data: { cartId: userCart.id },
        });
      }
    }

    // Delete the guest cart (cascade deletes any remaining items)
    await prisma.cart.delete({ where: { id: guestCart.id } });

    // Point cookie to user cart
    cookieStore.set('cartId', userCart.id);
  } else {
    // No existing user cart — just claim the guest cart
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { userId },
    });
  }
}
