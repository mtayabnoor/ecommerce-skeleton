'use client';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { signUpSchema } from '@/lib/validators';

function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // 1. Validate with Zod first
    const result = signUpSchema.safeParse(rawData);

    if (!result.success) {
      // Flatten Zod errors into a readable object
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email(
        {
          name: `${result.data.firstName} ${result.data.lastName}`,
          email: result.data.email,
          password: result.data.password,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          role: 'USER',
          callbackURL: callbackUrl,
        },
        {
          onSuccess: () => {
            router.push(callbackUrl);
          },
        },
      );

      if (error) {
        setErrors({ form: [error.message || 'Sign up failed'] });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" type="text" required />
            {errors?.firstName && (
              <p className="text-xs text-destructive">{errors.firstName[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" type="text" required />
            {errors?.lastName && (
              <p className="text-xs text-destructive">{errors.lastName[0]}</p>
            )}
          </div>
        </div>
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
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
          {errors?.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword[0]}</p>
          )}
        </div>
        <Button
          variant="default"
          type="submit"
          className="w-full mt-4"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
        {errors?.form && (
          <p className="text-xs text-destructive text-center">{errors.form[0]}</p>
        )}
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}

export { SignUpForm };
