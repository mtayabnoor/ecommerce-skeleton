'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuArrow,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';

function UserButton() {
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();
  const pathname = usePathname();

  if (isPending) {
    return <div className="size-6 rounded-full bg-background" />;
  }

  if (!session?.user) {
    return (
      <Link href="/auth/signin">
        <UserIcon className="size-6" />
      </Link>
    );
  }

  const name = session?.user?.name;
  const email = session?.user?.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer outline-none">
        <div className="rounded-full bg-primary text-primary-foreground size-8 flex items-center justify-center">
          <p>{name?.charAt(0).toUpperCase()}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuArrow className="fill-foreground" />
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p className="text-sm font-bold">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/help">Help &amp; FAQ</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <Button
          variant="default"
          className="cursor-pointer w-full"
          onClick={async () => {
            await authClient.signOut();
            const params = new URLSearchParams();
            params.set('callback', pathname);
            router.push(`/auth/signin?${params.toString()}`);
            router.refresh();
          }}
        >
          Sign Out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserButton };
