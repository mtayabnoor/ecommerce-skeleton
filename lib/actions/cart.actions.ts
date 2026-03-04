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
