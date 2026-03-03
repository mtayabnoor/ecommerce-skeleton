'use client';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="default" type="submit" className="w-full mt-4" disabled={pending}>
      {pending ? 'Signing up...' : 'Sign Up'}
    </Button>
  );
}

function SignUpForm() {
  const [data, formAction] = useActionState(signUpWithCredentials, {
    success: false,
    message: '',
    fields: {} as Record<string, string[]>,
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <form action={formAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" type="text" required />
            {data?.fields?.firstName && (
              <p className="text-xs text-destructive">{data.fields.firstName[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" type="text" required />
            {data?.fields?.lastName && (
              <p className="text-xs text-destructive">{data.fields.lastName[0]}</p>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          {data?.fields?.email && (
            <p className="text-xs text-destructive">{data.fields.email[0]}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {data?.fields?.password && (
            <p className="text-xs text-destructive">{data.fields.password[0]}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
          {data?.fields?.confirmPassword && (
            <p className="text-xs text-destructive">{data.fields.confirmPassword[0]}</p>
          )}
        </div>
        <SubmitButton />
        {data?.success && <p className="text-green-500 text-center">{data.message}</p>}
        {data?.success === false && (
          <p className="text-xs text-destructive text-center">{data.message}</p>
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
