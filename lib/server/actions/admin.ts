'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper to verify admin status securely on every action
async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

// --- Categories ---

export async function createCategory(formData: FormData) {
  await verifyAdmin();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) throw new Error('Name is required');

  const slug = name
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '');

  await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  await verifyAdmin();

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath('/admin/categories');
}

// --- Products ---

export async function deleteProduct(id: string) {
  await verifyAdmin();

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
}

// --- Users ---

export async function updateUserRole(userId: string, newRole: 'USER' | 'ADMIN') {
  await verifyAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath('/admin/users');
}

// --- Orders ---

export async function updateOrderStatus(orderId: string, status: any) {
  await verifyAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath('/admin/orders');
}
