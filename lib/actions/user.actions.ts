'use server';

import { auth } from '@/auth';
import { signInSchema, signUpSchema } from '@/lib/validators';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
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
    const email = parsed.data.email;
    const password = parsed.data.password;

    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

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
  await auth.api.signOut({
    headers: await headers(),
  });
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

    const callbackUrl = (formData.get('callbackUrl') as string) || '/';
    const { firstName, lastName, email, password } = parsed.data;

    // 🔥 THIS replaces your entire prisma + hash + signIn logic
    await auth.api.signUpEmail({
      body: {
        name: `${firstName} ${lastName}`,
        email,
        password,
        firstName,
        lastName,
        role: 'USER',
      },
    });

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    redirect(callbackUrl);
  } catch (
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any
  ) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error?.code === 'USER_ALREADY_EXISTS') {
      return {
        success: false,
        message: 'User with this email already exists',
        fields: {},
      };
    }

    return {
      success: false,
      message: 'An error occurred during sign up.',
      fields: {},
    };
  }
}
