import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Cookies from 'js-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertPrismaObjectToJSON<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}`;
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export const getOrCreateCartSessionId = () => {
  let sessionCartId = Cookies.get('sessionCartId');

  if (!sessionCartId) {
    sessionCartId = crypto.randomUUID();
    Cookies.set('sessionCartId', sessionCartId, { expires: 30 });
  }

  return sessionCartId;
};
