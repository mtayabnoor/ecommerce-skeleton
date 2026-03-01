'use server';

import { signIn, signOut } from '@/auth';
import { signInSchema, signUpSchema } from '@/lib/validators';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { prisma } from '@/lib/prisma';
import { hashSync } from 'bcrypt-ts-edge';

export async function signInWithCredentials(previousState: unknown, formData: FormData) {
  try {
    const parsed = signInSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
      const fieldErrors = Object.fromEntries(
        Object.entries(parsed.error.format())
          .filter(([key]) => key !== '_errors')
          .map(([key, value]) => [key, (value as { _errors: string[] })._errors]),
      );

      return {
        success: false,
        message: 'Invalid form data',
        fields: fieldErrors,
      };
    }

    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return {
      success: true,
      message: 'User signed in successfully',
      fields: {},
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: 'Invalid email or password',
      fields: {},
    };
  }
}

export async function signOutAction() {
  await signOut();
}

export async function signUpWithCredentials(previousState: unknown, formData: FormData) {
  try {
    const parsed = signUpSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
      const fieldErrors = Object.fromEntries(
        Object.entries(parsed.error.format())
          .filter(([key]) => key !== '_errors')
          .map(([key, value]) => [key, (value as { _errors: string[] })._errors]),
      );

      return {
        success: false,
        message: 'Invalid form data',
        fields: fieldErrors,
      };
    }

    const { firstName, lastName, email, password } = parsed.data;

    // Check if user already exists
    const userExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userExists) {
      return {
        success: false,
        message: 'User with this email already exists',
        fields: {},
      };
    }

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashSync(password, 10),
        role: 'user',
      },
    });

    return {
      success: true,
      message: 'User signed up successfully. Please log in.',
      fields: {},
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: 'An error occurred during sign up.',
      fields: {},
    };
  }
}
