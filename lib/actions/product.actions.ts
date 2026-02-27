'use server';

import { prisma } from '../prisma';
import { convertPrismaObjectToJSON } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertPrismaObjectToJSON(data) as Product[];
}

export { getProducts };
