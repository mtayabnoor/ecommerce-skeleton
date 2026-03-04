import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getOrCreateCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (cartId) {
    const existing = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (existing) return existing;
  }

  const newCart = await prisma.cart.create({
    data: {},
  });

  cookieStore.set('cartId', newCart.id);

  return newCart;
}
