// server/queries/orders.ts
import { prisma } from '@/lib/prisma';
import { createCachedFunction, CACHE_TAGS } from '@/lib/cache';
import { getCurrentUser, hasPermission, PERMISSIONS } from '@/lib/roles';

// ─── Cached core functions (no dynamic data sources inside) ──────────────────

const _getOrdersCached = createCachedFunction(
  async (page: number, limit: number, status: string, userId: string | null) => {
    const skip = (page - 1) * limit;
    let where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: { select: { id: true, name: true, images: true, slug: true } },
            },
          },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },
  [CACHE_TAGS.orders],
  60,
);

const _getOrderCached = createCachedFunction(
  async (orderId: string, userId: string | null) => {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;

    return prisma.order.findUnique({
      where,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true,
                price: true,
                sku: true,
              },
            },
          },
        },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },
  [CACHE_TAGS.order],
  60,
);

const _getRecentOrdersCached = createCachedFunction(
  async (limit: number, userId: string | null) => {
    const where: any = userId ? { userId } : {};

    return prisma.order.findMany({
      where,
      include: {
        orderItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: { select: { id: true, name: true, images: true } },
          },
        },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
  [CACHE_TAGS.orders],
  60,
);

const _getUserOrdersCached = createCachedFunction(
  async (userId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              product: { select: { id: true, name: true, images: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);
    return {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },
  [CACHE_TAGS.orders],
  60,
);

export async function getOrders({
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
  const canViewAll = await hasPermission(PERMISSIONS.ORDER_READ_ALL);
  const userId = canViewAll ? null : ((await getCurrentUser())?.id ?? null);
  return _getOrdersCached(page, limit, status, userId);
}

export async function getOrder(orderId: string) {
  const canViewAll = await hasPermission(PERMISSIONS.ORDER_READ_ALL);
  const userId = canViewAll ? null : ((await getCurrentUser())?.id ?? null);
  return _getOrderCached(orderId, userId);
}

export async function getOrderById(orderId: string) {
  return getOrder(orderId);
}

export async function getUserOrders(userId: string, page = 1, limit = 10) {
  return _getUserOrdersCached(userId, page, limit);
}

export async function getRecentOrders(limit = 10) {
  const canViewAll = await hasPermission(PERMISSIONS.ORDER_READ_ALL);
  const userId = canViewAll ? null : ((await getCurrentUser())?.id ?? null);
  return _getRecentOrdersCached(limit, userId);
}

export const getOrderStatistics = createCachedFunction(
  async () => {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.aggregate({
        where: { status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { total: true },
      }),
    ]);

    return {
      total: totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
      revenue: totalRevenue._sum.total || 0,
    };
  },
  [CACHE_TAGS.orders],
  300,
);

export const getOrderAnalytics = createCachedFunction(
  async (period: 'day' | 'week' | 'month' = 'month') => {
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const [orders, revenue] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true, total: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] },
        },
        _sum: { total: true },
      }),
    ]);

    const ordersByDate = orders.reduce(
      (acc, order) => {
        const date = order.createdAt.toDateString();
        if (!acc[date]) acc[date] = { count: 0, revenue: 0 };
        acc[date].count++;
        if (['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status))
          acc[date].revenue += Number(order.total);
        return acc;
      },
      {} as Record<string, { count: number; revenue: number }>,
    );

    return {
      totalRevenue: revenue._sum.total || 0,
      totalOrders: orders.length,
      ordersByDate,
    };
  },
  [CACHE_TAGS.orders],
  300,
);
