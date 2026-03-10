'use client';

import { useCart } from '@/lib/store/cart';
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
import { formatCurrency } from '@/lib/utils';

function CartDrawer() {
  const { cartItems, updateQuantity, removeItem, totalAmount } = useCart();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors cursor-pointer">
          {cartItems.length > 0 && (
            <Badge className="absolute top-0 right-0 min-w-[20px] h-5 flex items-center justify-center p-0 text-[10px] rounded-full border-2 border-background">
              {cartItems.length}
            </Badge>
          )}
          <ShoppingCart className="size-6" />
        </div>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col h-full right-0 p-0 border-l border-border/50 shadow-2xl">
        <SheetHeader className="p-6 bg-muted/20 border-b border-border/50">
          <SheetTitle className="text-xl font-bold tracking-tight">
            Shopping Cart
          </SheetTitle>
          <SheetDescription className="text-sm">
            {cartItems.length === 0
              ? 'Your cart is currently empty.'
              : `You have ${cartItems.length} item${cartItems.length === 1 ? '' : 's'} in your bag.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto w-full p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
                <ShoppingCart className="size-10 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium text-lg">
                Your cart is empty
              </p>
              <Button
                onClick={() => setIsOpen(false)}
                asChild
                className="rounded-full px-8 shadow-sm"
              >
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-row gap-4 border border-border/50 bg-card rounded-2xl p-4 shadow-sm"
                >
                  <div className="relative size-24 rounded-xl overflow-hidden bg-muted/50 shrink-0 border border-border/30">
                    <Image
                      src={item.image || '/images/product-sample.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1 px-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="text-sm font-semibold line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm text-primary font-medium mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 -mr-2 -mt-2"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 bg-muted rounded-full p-1 border border-border/50">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-full hover:bg-background"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-full hover:bg-background"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>

                      <p className="text-sm font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-auto bg-card border-t border-border p-6 space-y-4 shadow-xl">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50">
                <span>Total</span>
                <span>{formatCurrency(totalAmount())}</span>
              </div>
            </div>

            <Button
              className="w-full text-base h-14 shadow-lg"
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

export { CartDrawer };
