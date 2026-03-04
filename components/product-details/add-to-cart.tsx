'use client';

import { Button } from '../ui/button';
import { CartItem } from '@/types';
import { toast } from 'sonner';
import { addToCart } from '@/lib/actions/cart.actions';
import { useCart } from '@/store/cart.store';

function AddToCart({ isInStock, item }: { isInStock: boolean; item: CartItem }) {
  const setCart = useCart((s) => s.setCart);

  const handleAddToCart = async () => {
    const updatedItems = (await addToCart(item)) as CartItem[];
    setCart(updatedItems);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <Button
      size="lg"
      className="flex-1 h-12 text-base font-semibold rounded-none"
      disabled={!isInStock}
      onClick={handleAddToCart}
    >
      {isInStock ? 'Add to bag' : 'Sold out'}
    </Button>
  );
}

export { AddToCart };
