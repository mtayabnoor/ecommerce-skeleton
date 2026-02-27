'use client';
import Image from 'next/image';
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductPrice } from './product-price';
import { Product } from '@/types';
import Link from 'next/link';
import { Rating } from './product-rating';
import { Input } from '@/components/ui/input';
import { ProductImages } from './product-images';
import { useState } from 'react';

function ProductDetails2({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState<number>(1);

  // 2. Handle the change safely
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    // Prevent NaN, negative numbers, or exceeding stock
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(value);
    }
  };
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Images Column */}
        <div className="col-span-1 p-5">
          <ProductImages images={product.images} name={product.name} />
        </div>
        {/* Details Column and Actions Column */}
        <div className="col-span-1 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <div className="flex items-center gap-1">
              <Rating
                rating={Number(product.rating)}
                numReviews={Number(product.numReviews)}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <ProductPrice
                value={product.price}
                className="rounded-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
          </div>
          <div className="mt-10">
            <p className="text-md font-semibold">Description</p>
            <p className="mt-2">{product.description}</p>
          </div>

          <Card>
            <CardContent>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <p>Price</p>
                  <ProductPrice value={product.price} />
                </div>
                <div className="flex justify-between">
                  <p>Status</p>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex justify-between">
                    <p>Quantity</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-5"
                        onClick={() => setQuantity(quantity - 1)}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={product.stock}
                        // 3. Bind the state to the value
                        value={quantity}
                        // 4. Bind the handler to onChange
                        onChange={handleQuantityChange}
                        className="w-24 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-5"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export { ProductDetails2 };
