'use client';

import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { APP_NAME } from '@/lib/constants';

export default function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs items-center gap-2">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-6">
            <SheetTitle className="font-bold text-xl mb-4">{APP_NAME}</SheetTitle>
            <div className="flex items-center gap-2 mt-2 w-full justify-between">
              <span className="font-medium text-sm">Theme</span>
              <ModeToggle />
            </div>
            <div className="flex flex-col gap-4 mt-6 w-full">
              <Button asChild variant="outline" className="justify-start w-full">
                <Link href="/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                </Link>
              </Button>
              <Button asChild className="justify-start w-full">
                <Link href="/sign-in">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
