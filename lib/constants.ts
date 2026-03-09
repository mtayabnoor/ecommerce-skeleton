export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Ecommerce Skeleton';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A skeleton for an ecommerce website';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const APP_CACHE_VERSION = process.env.NEXT_PUBLIC_APP_CACHE_VERSION || 'v1';
export const APP_HASH_ALGO = process.env.NEXT_PUBLIC_APP_HASH_ALGO || 'argon2';

export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
