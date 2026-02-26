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

  const formattedProducts = data.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: Number(product.rating),
  }));

  return convertPrismaObjectToJSON(formattedProducts) as Product[];
}

export { getProducts };
