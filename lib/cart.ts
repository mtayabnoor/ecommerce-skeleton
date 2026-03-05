import { cookies, headers } from 'next/headers';
import { prisma } from './prisma';
import { auth } from '@/lib/auth';

export async function getOrCreateCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  // Check if user is logged in
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  // 1. Logged-in user: try to find their cart by userId
  if (userId) {
    const userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (userCart) {
      // Ensure cookie points to this cart
      cookieStore.set('cartId', userCart.id);
      return userCart;
    }
  }

  // 2. Try cookie-based cart (guest or logged-in user without a userId cart yet)
  if (cartId) {
    const existing = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (existing) return existing;
  }

  // 3. Create a new cart
  const newCart = await prisma.cart.create({
    data: {
      ...(userId ? { userId } : {}),
    },
  });

  cookieStore.set('cartId', newCart.id);

  return newCart;
}
