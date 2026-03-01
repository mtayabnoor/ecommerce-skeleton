'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProductPrice } from './product-price';
import { Rating } from './product-rating';
import { ProductImages } from './product-images';
import { Product } from '@/types';

function ProductDetails2({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState<number>(1);

  // Safely handles manual typing in the input box
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

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
        <div className="col-span-1 p-5 min-w-0">
          <ProductImages images={product.images} name={product.name} />
        </div>

        {/* Details Column */}
        <div className="col-span-1 p-5 min-w-0 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-gray-500 uppercase tracking-wide text-sm">
              {product.brand} {product.category}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center gap-2">
              <Rating
                rating={Number(product.rating)}
                numReviews={Number(product.numReviews)}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
              <div className="rounded-full bg-green-100 text-green-700 px-5 py-2 inline-flex w-max font-semibold">
                <ProductPrice value={product.price} />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Action Card */}
          <Card className="mt-4">
            {/* Added p-6 because CardContent has pt-0 by default in shadcn */}
            <CardContent className="p-6">
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price</span>
                  <div className="font-bold text-lg">
                    <ProductPrice value={product.price} />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  {product.stock > 0 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      In stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>

                {/* Only show Quantity selector if in stock */}
                {product.stock > 0 && (
                  <div className="flex justify-between items-center mt-2 pt-4 border-t">
                    <span className="font-medium">Quantity</span>
                    <div className="flex items-center gap-2">
                      {/* FIX 1: Disabled when quantity is 1 */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8" // size-5 was too small to click easily
                        disabled={quantity <= 1}
                        onClick={() => setQuantity(quantity - 1)}
                      >
                        -
                      </Button>

                      <Input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 text-center h-8"
                      />

                      {/* FIX 2: Disabled when quantity reaches max stock */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={quantity >= product.stock}
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
