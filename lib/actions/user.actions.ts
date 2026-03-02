'use server';

import { signIn, signOut } from '@/auth';
import { signInSchema, signUpSchema } from '@/lib/validators';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { prisma } from '@/lib/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function signInWithCredentials(previousState: unknown, formData: FormData) {
  try {
    const parsed = signInSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
      const tree = z.treeifyError(parsed.error);

      const fieldErrors = Object.fromEntries(
        Object.entries(tree.properties ?? {}).map(([key, value]) => [
          key,
          value?.errors ?? [],
        ]),
      );

      return {
        success: false,
        message: 'Invalid form data',
        fields: fieldErrors,
      };
    }

    const callbackUrl = (formData.get('callbackUrl') as string) || '/';

    const result = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    if (!result || result.error) {
      return {
        success: false,
        message: 'Invalid email or password',
        fields: {},
      };
    }

    redirect(callbackUrl);
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
      const tree = z.treeifyError(parsed.error);

      const fieldErrors = Object.fromEntries(
        Object.entries(tree.properties ?? {}).map(([key, value]) => [
          key,
          value?.errors ?? [],
        ]),
      );

      return {
        success: false,
        message: 'Invalid form data',
        fields: fieldErrors,
      };
    }

    const { firstName, lastName, email, password } = parsed.data;
    const plainPassword = password;

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

    await signIn('credentials', {
      email: parsed.data.email,
      password: plainPassword,
    });

    return {
      success: true,
      message: 'User registered successfully.',
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
