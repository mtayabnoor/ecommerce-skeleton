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
import { signOutAction } from '@/lib/actions/user.actions';
import { auth } from '@/auth';

async function UserButton() {
  const session = await auth();

  const name = `${session?.user?.firstName} ${session?.user?.lastName}`;
  const email = session?.user?.email;

  if (!session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Button
            variant="ghost"
            className="cursor-pointer hover:bg-transparent dark:hover:bg-transparent"
          >
            <UserIcon className="size-6" />
          </Button>
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
      <DropdownMenuTrigger className="outline-none">
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-transparent dark:hover:bg-transparent"
        >
          <UserIcon className="size-6" />
        </Button>
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
        <form action={signOutAction} className="w-full p-2">
          <Button variant="default" className="cursor-pointer w-full">
            Sign Out
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserButton };
