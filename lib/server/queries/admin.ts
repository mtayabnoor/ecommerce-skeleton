import { prisma } from '@/lib/prisma';
import { serialize } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== 'ADMIN') {
    console.log(session?.user);
    throw new Error('Unauthorized');
  }
}

export async function getAdminUsers() {
  await verifyAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return serialize(users);
}

export async function getAdminOrders() {
  await verifyAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: true,
      user: {
        select: { email: true, name: true },
      },
    },
  });
  return serialize(orders);
}

export async function getAdminProducts() {
  await verifyAdmin();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      inventory: true,
    },
  });
  return serialize(products);
}

export async function getAdminCategories() {
  await verifyAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
  return serialize(categories);
}

export async function getAdminDashboardStats() {
  await verifyAdmin();
  const [userCount, productCount, categoryCount, orderCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
  ]);
  return { userCount, productCount, categoryCount, orderCount };
}
