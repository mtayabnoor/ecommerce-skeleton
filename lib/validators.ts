import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
    'Price must be a 2 decimal number',
  );

// Schema for inserting a new product
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  stock: z.coerce.number().min(1, 'Stock must be greater than 0'),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  banner: z.string().nullable(),
  price: currency,
  isFeatured: z.boolean().default(false),
});

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signUpSchema = z
  .object({
    firstName: z.string().min(3, 'First name must be at least 3 characters long'),
    lastName: z.string().min(3, 'Last name must be at least 3 characters long'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
