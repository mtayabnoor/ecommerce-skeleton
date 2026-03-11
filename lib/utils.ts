import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError, ZodSchema } from 'zod';
import { ActionResponse } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serialize<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data));
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

export function formatZodErrors(error: ZodError) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.'); // handles nested objects

    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }

    fieldErrors[path].push(issue.message);
  }

  return {
    success: false as const,
    message: 'Input validation failed',
    fieldErrors,
  };
}

export function createServerAction<TSchema, TResult>(
  schema: ZodSchema<TSchema>,
  handler: (data: TSchema) => Promise<TResult>,
) {
  return async (
    prevState: ActionResponse<TResult>,
    formData: FormData,
  ): Promise<ActionResponse<TResult>> => {
    const raw = Object.fromEntries(formData);

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      return formatZodErrors(parsed.error);
    }

    try {
      const result = await handler(parsed.data);

      return {
        success: true,
        message: 'Success',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  };
}
