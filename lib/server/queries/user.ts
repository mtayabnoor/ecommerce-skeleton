'use server';

import { getCurrentUser, hasPermission } from '@/lib/roles';
import { PERMISSIONS } from '@/lib/roles';
import { createCachedFunction } from '@/lib/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/cache';

const _getUsersCached = createCachedFunction(
  async (page: number, limit: number, status: string, userId: string | null) => {
    const skip = (page - 1) * limit;
    let where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },
  [CACHE_TAGS.users],
  60,
);

export async function getUsers({
  page = 1,
  limit = 20,
  status = '',
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
} = {}) {
  const canViewAll = await hasPermission(PERMISSIONS.USER_READ_ALL);
  const userId = canViewAll ? null : ((await getCurrentUser())?.id ?? null);
  return _getUsersCached(page, limit, status, userId);
}
