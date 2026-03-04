'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuArrow,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

function UserButton() {
  const { data: session } = authClient.useSession();

  const name = session?.user?.name;
  const email = session?.user?.email;
  console.log(session);

  if (!session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <UserIcon className="size-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuArrow className="fill-foreground" />
          <DropdownMenuItem>
            <div className="w-full">
              <Button className="w-full">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/sign-up"
              className="font-bold underline text-foreground underline-offset-4 decoration-2"
            >
              Register
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer outline-none">
        <UserIcon className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuArrow className="fill-foreground" />
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p className="text-sm font-bold">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/account">Account</Link>
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
          }}
        >
          Sign Out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserButton };
