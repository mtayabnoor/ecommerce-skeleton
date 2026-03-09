import Link from 'next/link';
import { Heart } from 'lucide-react';
import { UserButton } from './user-button';
import { ModeToggle } from './theme-toggle-button';
import { CartDrawer } from './cart-drawer';

function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="flex w-full max-w-xs items-center gap-2">
        <UserButton />
        <ModeToggle />
        <Link href="/wishlist">
          <Heart className="size-6" />
        </Link>
        <CartDrawer />
      </nav>
    </div>
  );
}

export { Menu };
