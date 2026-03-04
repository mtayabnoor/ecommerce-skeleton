'use client';

import { useCart } from '@/store/cart.store';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function CartSidebar() {
  const { items, increase, decrease, remove, getTotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative cursor-pointer">
          {items.length > 0 && (
            <Badge className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
              {items.length}
            </Badge>
          )}
          <ShoppingCart className="size-6" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full right-0 p-4">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>You have {items.length} items in your bag.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingCart className="size-16 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Button onClick={() => setIsOpen(false)} asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex flex-row border-b py-4">
                <div className="relative size-20 rounded overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6"
                      onClick={() => decrease(item.productId)}
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium w-4 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6"
                      onClick={() => increase(item.productId)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <p className="text-sm font-semibold">{item.price}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => remove(item.productId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-auto space-y-4 pt-4 border-t">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${getTotal()}</span>
            </div>
            <Button
              className="w-full text-lg h-12"
              asChild
              onClick={() => setIsOpen(false)}
            >
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
