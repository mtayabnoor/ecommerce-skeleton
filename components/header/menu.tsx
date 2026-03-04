'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Heart } from 'lucide-react';
import { UserButton } from './user-button';
import { ModeToggle } from './mode-toggle';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/store/cart.store';
import { Badge } from '@/components/ui/badge';

function Menu() {
  const { items } = useCart();
  return (
    <div className="flex justify-end gap-3">
      <nav className="flex w-full max-w-xs items-center gap-5">
        <ModeToggle />
        <Separator orientation="vertical" />
        <UserButton />
        <Link href="/wishlist">
          <Heart className="size-6" />
        </Link>
        <Link href="/cart">
          <div className="relative">
            {items.length > 0 && (
              <Badge className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
                {items.length}
              </Badge>
            )}
            <ShoppingCart className="size-6" />
          </div>
        </Link>
      </nav>
    </div>
  );
}

export { Menu };
