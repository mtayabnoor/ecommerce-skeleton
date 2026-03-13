'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuArrow,
  DropdownMenuGroup,
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
    return <UserIcon className="size-6" />;
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
        <UserIcon className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 cursor-pointer">
        <DropdownMenuArrow className="fill-foreground" />
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <p className="text-sm font-bold">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          {session.user.role === 'admin' && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/admin/dashboard">Admin Dashboard</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/orders">Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/help">Help &amp; FAQ</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Button
            variant="default"
            className="cursor-pointer w-full"
            onClick={async () => {
              await authClient.signOut();
              const params = new URLSearchParams();
              params.set('callbackUrl', pathname);
              router.push(`/auth/signin?${params.toString()}`);
              router.refresh();
            }}
          >
            Sign Out
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserButton };
