'use client';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { signInSchema } from '@/lib/validators';

function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const result = signInSchema.safeParse(rawData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
        callbackURL: callbackUrl,
      });

      if (error) {
        setErrors({ form: [error.message || 'Sign in failed'] });
        return;
      }

      router.push(callbackUrl);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          {errors?.email && <p className="text-xs text-destructive">{errors.email[0]}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {errors?.password && (
            <p className="text-xs text-destructive">{errors.password[0]}</p>
          )}
        </div>

        <Button
          variant="default"
          type="submit"
          className="w-full mt-4"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        {errors?.form && (
          <p className="text-xs text-destructive text-center">{errors.form[0]}</p>
        )}
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="underline">
          Sign Up
        </Link>
      </div>
    </form>
  );
}

export { SignInForm };
