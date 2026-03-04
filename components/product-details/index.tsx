'use client';

import { useState } from 'react';
import { Heart, Truck, Globe, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ProductPrice } from './product-price';
import { Rating } from './product-rating';
import { ProductImages } from './product-images';
import { Product } from '@/types';
import Link from 'next/link';
import { AddToCart } from './add-to-cart';

function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isInStock = product.stock > 0;

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
    <section className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left — Images (3/5 columns) */}
        <div className="md:col-span-3 min-w-0">
          <div className="relative">
            {/* Overlaid Badges */}
            {(product.isFeatured || !isInStock) && (
              <div className="absolute top-4 left-20 md:left-24 z-10 flex flex-col gap-1">
                {product.isFeatured && (
                  <Badge className="bg-foreground text-background text-xs rounded-none">
                    New
                  </Badge>
                )}
                {!isInStock && (
                  <Badge variant="destructive" className="text-xs rounded-none">
                    Sold out
                  </Badge>
                )}
              </div>
            )}
            <ProductImages images={product.images} name={product.name} />
          </div>
        </div>

        {/* Right — Product Info (2/5 columns) */}
        <div className="md:col-span-2 flex flex-col gap-1 min-w-0">
          {/* Brand */}
          <Link
            href="/"
            className="text-sm font-semibold underline underline-offset-2 decoration-foreground/60 hover:decoration-foreground transition-colors"
          >
            {product.brand}
          </Link>

          {/* Product Name */}
          <h1 className="text-base font-normal leading-snug text-foreground">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-1.5">
            <Rating rating={Number(product.rating)} numReviews={product.numReviews} />
          </div>

          {/* Price */}
          <div className="mt-3">
            <ProductPrice value={product.price} className="text-foreground font-bold" />
            <span className="text-xs text-muted-foreground ml-1">incl. VAT</span>
          </div>

          {/* Stock Status */}
          <div className="mt-3">
            {isInStock ? (
              <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                ✓ In stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-destructive font-medium">
                ✗ Currently out of stock
              </span>
            )}
          </div>

          {/* Quantity */}
          {isInStock && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium">Qty</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-14 text-center h-9 rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          )}

          {/* Add to Bag + Wishlist */}
          <div className="mt-5 flex items-center gap-2">
            <AddToCart
              isInStock={isInStock}
              item={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0],
                quantity: quantity,
              }}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0 rounded-none"
              onClick={() => setIsWishlisted((prev) => !prev)}
              aria-label="Add to wishlist"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none text-foreground'
                }`}
              />
            </Button>
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator className="my-4" />

          {/* Shipping Info */}
          <Card className="rounded-none border">
            <CardContent className="p-0">
              <div className="flex items-start gap-3 px-4 py-3">
                <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Standard delivery</p>
                  <p className="text-xs text-muted-foreground">2-4 business days</p>
                </div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  free
                </span>
              </div>

              <Separator />

              <div className="flex items-center gap-3 px-4 py-3">
                <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-sm font-semibold">Free delivery and free returns</p>
              </div>

              <Separator />

              <div className="flex items-center gap-3 px-4 py-3">
                <RotateCcw className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-sm font-semibold">30 day return policy</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export { ProductDetails };
