import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { SignInForm } from '@/components/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <Link href="/">
            <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
          </Link>
          <CardTitle>Sign in or register</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
