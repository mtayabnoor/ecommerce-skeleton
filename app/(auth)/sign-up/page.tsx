import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignUpForm } from '@/components/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
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
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
