'use client';

import { Button } from '../ui/button';
import { CartItem } from '@/types';
import { useCart } from '@/store/cart.store';

function AddToCart({ isInStock, item }: { isInStock: boolean; item: CartItem }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
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
