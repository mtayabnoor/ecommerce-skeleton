'use server';

import { signIn, signOut } from '@/auth';
import { signInSchema } from '@/lib/validators';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function signInWithCredentials(previousState: unknown, formData: FormData) {
  try {
    const user = signInSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: user.email,
      password: user.password,
      redirect: false,
    });

    return {
      success: true,
      message: 'User signed in successfully',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
}

export async function signOutAction() {
  await signOut();
}
