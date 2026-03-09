import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { SignInForm } from '@/components/signin-form';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Sign In',
};

interface signInProps {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}

export default async function SignInPage({ searchParams }: signInProps) {
  const { callbackUrl } = await searchParams;

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect(callbackUrl || '/');
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <Link href="/">
            <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
          </Link>
          <CardTitle>Sign in or register</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
