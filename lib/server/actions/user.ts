'use server';

import { prisma } from '@/lib/prisma';
import { hasPermission, PERMISSIONS } from '@/lib/roles';
import { revalidateUsers } from '@/lib/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
  const canUpdate = await hasPermission(PERMISSIONS.USER_UPDATE);
  if (!canUpdate) {
    return { success: false, error: 'Unauthorized' };
  }

  await auth.api.setRole({
    body: {
      userId,
      role,
    },
    headers: await headers(),
  });
  revalidateUsers();
  return { success: true, message: 'User role updated successfully' };
};
