'use client';

import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { signInSchema } from '@/lib/validators';
import { formatZodErrors } from '@/lib/utils';
import { ActionResponse } from '@/types';

function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const [errors, setErrors] = useState<ActionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const finalCallbackUrl = callbackUrl || '/';

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const result = signInSchema.safeParse(rawData);

    if (!result.success) {
      const formatted = formatZodErrors(result.error);
      setErrors(formatted);
      return;
    }

    try {
      await authClient.signIn.email(
        {
          email: result.data.email,
          password: result.data.password,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onResponse: () => {
            setLoading(false);
          },
          onSuccess: async () => {
            router.push(finalCallbackUrl);
            router.refresh();
          },
          onError: (ctx) => {
            setErrors({
              success: false,
              message: ctx.error.message,
            });
          },
        },
      );
    } catch (error) {
      setErrors({
        success: false,
        message: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrlUrl" value={finalCallbackUrl} />
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          {!errors?.success && errors?.fieldErrors?.email && (
            <p className="text-xs text-destructive">{errors?.fieldErrors?.email[0]}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {!errors?.success && errors?.fieldErrors?.password && (
            <p className="text-xs text-destructive">{errors?.fieldErrors?.password[0]}</p>
          )}
        </div>

        <Button
          variant="default"
          type="submit"
          className="w-full mt-4"
          disabled={loading}
        >
          Sign In
        </Button>
        {!errors?.success && errors?.message && (
          <p className="text-xs text-destructive text-center">{errors.message}</p>
        )}
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="underline">
          Sign Up
        </Link>
      </div>
    </form>
  );
}

export { SignInForm };
