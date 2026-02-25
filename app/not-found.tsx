'use client';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
        width={48}
        height={48}
        priority={true}
      />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold mt-2">Not Found</h1>
        <p className="text-red-500">Could not find the page you are looking for</p>
        <Button asChild>
          <Link href="/">Go back to home</Link>
        </Button>
      </div>
    </div>
  );
}
