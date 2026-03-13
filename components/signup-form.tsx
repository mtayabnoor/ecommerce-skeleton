'use client';

import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { signUpSchema } from '@/lib/validators';
import { formatZodErrors } from '@/lib/utils';
import { ActionResponse } from '@/types';
import { useState } from 'react';

function SignUpForm({ callbackUrl }: { callbackUrl?: string }) {
  const [errors, setErrors] = useState<ActionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const finalCallbackUrl = callbackUrl || '/';

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    const result = signUpSchema.safeParse(data);

    if (!result.success) {
      const formatted = formatZodErrors(result.error);
      setErrors(formatted);
      return;
    }

    try {
      await authClient.signUp.email(
        {
          name: `${result.data.firstName} ${result.data.lastName}`,
          email: result.data.email,
          password: result.data.password,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          role: 'user',
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={finalCallbackUrl} />
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" type="text" required />
            {!errors?.success && errors?.fieldErrors?.firstName && (
              <p className="text-xs text-destructive">
                {errors.fieldErrors.firstName[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" type="text" required />
            {!errors?.success && errors?.fieldErrors?.lastName && (
              <p className="text-xs text-destructive">{errors.fieldErrors.lastName[0]}</p>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          {!errors?.success && errors?.fieldErrors?.email && (
            <p className="text-xs text-destructive">{errors.fieldErrors.email[0]}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {!errors?.success && errors?.fieldErrors?.password && (
            <p className="text-xs text-destructive">{errors.fieldErrors.password[0]}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
          {!errors?.success && errors?.fieldErrors?.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>
        <Button
          variant="default"
          type="submit"
          className="w-full mt-4"
          disabled={loading}
        >
          Sign Up
        </Button>
        {errors?.message && (
          <p className="text-xs text-destructive text-center">{errors.message}</p>
        )}
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/signin" className="underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}

export { SignUpForm };
