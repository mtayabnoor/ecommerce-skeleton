'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductPrice } from './product-price';
import { Product } from '@/types';
import Link from 'next/link';

function ProductDetails({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);

  const isInStock = product.stock > 0;
  const rating = Number(product.rating);

  return (
    <section className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column — Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
            {product.images.length > 0 ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-md border-2 transition-all ${
                    activeImage === i
                      ? 'border-foreground ring-1 ring-foreground/20'
                      : 'border-transparent hover:border-muted-foreground/40'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Image ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column — Product Info */}
        <div className="flex flex-col gap-5">
          {/* Category & Stock Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.isFeatured && <Badge>New</Badge>}
            <Badge variant={isInStock ? 'outline' : 'destructive'}>
              {isInStock ? `In Stock (${product.stock})` : 'Out of Stock'}
            </Badge>
          </div>

          {/* Brand */}
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {product.brand}
          </p>

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-muted text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <Separator />

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              <ProductPrice value={product.price} />
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <Separator />

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              size="lg"
              className="flex-1 sm:flex-none sm:min-w-[200px] gap-2"
              disabled={!isInStock}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInStock ? 'Add to Cart' : 'Sold Out'}
            </Button>
          </div>

          {/* Trust Signals */}
          <Card className="border-dashed">
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">Encrypted checkout</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export { ProductDetails };
