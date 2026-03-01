'use client';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInWithCredentials } from '@/lib/actions/user.actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="default" type="submit" className="w-full mt-4" disabled={pending}>
      {pending ? 'Signing in...' : 'Sign In'}
    </Button>
  );
}

export function SignInForm() {
  const [data, formAction] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });

  return (
    <form action={formAction}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <SubmitButton />
        {data?.success && <p className="text-green-500 text-center">{data.message}</p>}
        {data?.success === false && (
          <p className="text-destructive text-center">{data.message}</p>
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
