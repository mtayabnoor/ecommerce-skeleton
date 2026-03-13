'use server';

import { getCurrentUser, hasPermission } from '@/lib/roles';
import { PERMISSIONS } from '@/lib/roles';
import { createCachedFunction } from '@/lib/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/cache';

const _getCategoriesCached = createCachedFunction(
  async (page: number, limit: number, search?: string) => {
    const skip = (page - 1) * limit;
    let where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.category.count({ where }),
    ]);

    return {
      success: true,
      message: 'Categories fetched successfully',
      data: {
        categories,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    };
  },
  [CACHE_TAGS.categories],
  60,
);

export const getCategories = async ({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
} = {}) => {
  const canViewAll = await hasPermission(PERMISSIONS.CATEGORY_READ_ALL);
  if (!canViewAll) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }
  return _getCategoriesCached(page, limit, search);
};
