import { Button } from '../ui/button';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { UserIcon } from 'lucide-react';
import { signOutAction } from '@/lib/actions/user.actions';
import { auth } from '@/auth';

async function UserLink() {
  const session = await auth();
  const userFirstName = session?.user?.firstName;
  const userLastName = session?.user?.lastName;
  if (session) {
    return (
      <div className="relative group z-50">
        <Link
          href="/account"
          className="flex items-center justify-center md:border-2 border-transparent group-hover:border-foreground group-hover:bg-background group-hover:dark:bg-background group-hover:border-b-transparent relative z-50"
        >
          <UserIcon className="size-6" />
        </Link>
        <div className="absolute right-0 top-[25.5px] hidden md:group-hover:block w-72 z-40 bg-background border-2 border-foreground p-4 shadow-lg">
          <div className="bg-background flex flex-col gap-1 rounded-none">
            <div className="flex flex-col gap-4 mt-2">
              <Link href="/account" className="text-sm hover:underline text-foreground">
                Account
              </Link>
              <Link href="/orders" className="text-sm hover:underline text-foreground">
                Orders
              </Link>
              <Link href="/help" className="text-sm hover:underline text-foreground">
                Help &amp; FAQ
              </Link>
            </div>
            <Separator className="my-2 bg-border" />
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-none mt-2"
              >
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group z-50">
      <Link
        href="/sign-in"
        className="flex items-center justify-center md:border-2 border-transparent group-hover:border-foreground group-hover:bg-background group-hover:dark:bg-background group-hover:border-b-transparent relative z-50"
      >
        <UserIcon className="size-6" />
      </Link>
      <div className="absolute right-0 top-[25.5px] hidden md:group-hover:block w-72 z-40 bg-background border-2 border-foreground p-4 shadow-lg">
        <div className="bg-background flex flex-col gap-1 rounded-none">
          <Button
            asChild
            className="w-full rounded-none font-bold bg-foreground text-background hover:bg-foreground/90 h-12"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <div className="text-sm mt-3 mb-2">
            <Link
              href="/sign-up"
              className="font-bold underline text-foreground underline-offset-4 decoration-2"
            >
              Register
            </Link>
          </div>
          <Separator className="my-2 bg-border" />
          <div className="flex flex-col gap-4 mt-2">
            <Link href="/account" className="text-sm hover:underline text-foreground">
              Your account
            </Link>
            <Link href="/orders" className="text-sm hover:underline text-foreground">
              Orders
            </Link>
            <Link href="/help" className="text-sm hover:underline text-foreground">
              Help &amp; FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { UserLink };
