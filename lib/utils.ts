import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertPrismaObjectToJSON(obj: unknown): unknown {
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

export function formatCurrency(
  amount: number | string | { toString(): string },
  currency: string = 'USD',
): string {
  let numericAmount: number;

  if (typeof amount === 'string') {
    numericAmount = parseFloat(amount);
  } else if (typeof amount === 'number') {
    numericAmount = amount;
  } else {
    numericAmount = parseFloat(amount.toString());
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
}

export const formatPrice = formatCurrency;
