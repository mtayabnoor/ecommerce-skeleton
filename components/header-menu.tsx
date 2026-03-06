import Link from 'next/link';
import { Heart } from 'lucide-react';
import { UserButton } from './user-button';
import { ModeToggle } from './theme-toggle-button';
import { CartSidebar } from './cart-drawer';

function Menu() {
  return (
    <div className="flex justify-end gap-2">
      <nav className="flex w-full max-w-xs items-center gap-5">
        <UserButton />
        <ModeToggle />
        <Link href="/wishlist">
          <Heart className="size-6" />
        </Link>
        <CartSidebar />
      </nav>
    </div>
  );
}

export { Menu };
