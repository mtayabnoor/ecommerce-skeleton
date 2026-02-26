'use client';

import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu as Burger, ShoppingCart, UserIcon } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { APP_NAME } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

function Menu() {
  return (
    <div className="flex justify-end gap-3">
      {/* ── Desktop nav ── */}
      <nav className="hidden md:flex w-full max-w-xs items-center gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart className="mr-1 h-4 w-4" />
            Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon className="mr-1 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      </nav>

      {/* ── Mobile nav ── */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Burger className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col p-6">
            <SheetTitle className="font-bold text-xl">{APP_NAME}</SheetTitle>
            <SheetDescription className="sr-only">Navigation menu</SheetDescription>

            <Separator className="my-2" />

            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ModeToggle />
            </div>

            <Separator className="my-2" />

            <div className="flex flex-col gap-2 mt-2 w-full">
              <SheetClose asChild>
                <Button asChild variant="outline" className="justify-start w-full">
                  <Link href="/cart">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="justify-start w-full">
                  <Link href="/sign-in">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

export { Menu };
