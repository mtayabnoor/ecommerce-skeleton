'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { UserButton } from './user-button';
import { ModeToggle } from './mode-toggle';
import { Separator } from '@/components/ui/separator';
import { CartSidebar } from '../cart/cart-sidebar';

function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="flex w-full max-w-xs items-center gap-5">
        <ModeToggle />
        <Separator orientation="vertical" />
        <UserButton />
        <Link href="/wishlist">
          <Heart className="size-6" />
        </Link>
        <CartSidebar />
      </nav>
    </div>
  );
}

export { Menu };
