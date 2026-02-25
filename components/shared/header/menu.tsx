'use client';
import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { UserIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart />
            <span>Cart</span>
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon />
            <span>Sign In</span>
          </Link>
        </Button>
      </nav>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <ModeToggle />
              <Button asChild variant="ghost">
                <Link href="/cart">
                  <ShoppingCart />
                  <span>Cart</span>
                </Link>
              </Button>
              <Button asChild>
                <Link href="/sign-in">
                  <UserIcon />
                  <span>Sign In</span>
                </Link>
              </Button>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
