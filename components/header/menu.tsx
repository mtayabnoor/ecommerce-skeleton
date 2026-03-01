'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, UserIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Heart } from 'lucide-react';

function Menu() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-end gap-3">
      {/* ── Desktop nav ── */}
      <nav className="flex w-full max-w-xs items-center gap-5">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer hover:bg-transparent"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Separator orientation="vertical" />
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
                <span className="text-muted-foreground"></span>
              </div>
              <Separator className="my-2 bg-border" />
              <div className="flex flex-col gap-4 mt-2">
                <Link href="/account" className="text-sm hover:underline text-foreground">
                  Your account
                </Link>
                <Link href="/orders" className="text-sm hover:underline text-foreground">
                  Orders
                </Link>
                <Link href="/returns" className="text-sm hover:underline text-foreground">
                  Return an item
                </Link>
                <Link href="/help" className="text-sm hover:underline text-foreground">
                  Help & FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Link href="/wishlist">
          <Heart className="size-6" />
        </Link>
        <Link href="/cart">
          <ShoppingCart className="size-6" />
        </Link>
      </nav>

      {/* ── Mobile nav ── */}
      {/*<nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Burger className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col p-6">
            <SheetTitle className="font-bold text-xl">{APP_NAME}</SheetTitle>
            <SheetDescription className="sr-only">Navigation menu</SheetDescription>

            <Separator className="my-2" />

            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ModeToggle />
            </div>

            <Separator className="my-2" />

            <div className="flex flex-col gap-2 mt-2 w-full">
              <SheetClose asChild>
                <Button asChild variant="outline" className="justify-start w-full">
                  <Link href="/cart">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="justify-start w-full">
                  <Link href="/sign-in">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav> */}
    </div>
  );
}

export { Menu };
