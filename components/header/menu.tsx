import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Heart } from 'lucide-react';
import { UserButton } from './user-button';
import { ModeToggle } from './mode-toggle';
import { Separator } from '@/components/ui/separator';

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
        <Link href="/cart">
          <ShoppingCart className="size-6" />
        </Link>
      </nav>
    </div>
  );
}

export { Menu };
