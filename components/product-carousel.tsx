// Location: components/product-carousel.tsx
'use client';

import * as React from 'react';
import { ProductCard } from './product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  images: Array<{ url: string; altText?: string | null }>;
  category?: {
    name: string;
    slug: string;
  } | null;
  inventory?: Array<{
    available: number;
  }>;
  reviews?: Array<{
    rating: number;
  }>;
}

interface ProductCarouselProps {
  products: Product[];
  className?: string;
}

export function ProductCarousel({ products, className }: ProductCarouselProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold">No products found</h3>
        <p className="max-w-sm text-muted-foreground">
          We couldn't find any products matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className={`w-full max-w-full ${className || ''}`}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => {
          // Calculate average rating
          const avgRating =
            product.reviews && product.reviews.length > 0
              ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
                product.reviews.length
              : 0;

          // Check stock availability
          const inStock =
            product.inventory && product.inventory.length > 0 && product.inventory[0]
              ? product.inventory[0].available > 0
              : true;

          // Get primary image
          const primaryImage =
            product.images && product.images.length > 0 && product.images[0]
              ? product.images[0].url
              : undefined;

          return (
            <CarouselItem
              key={product.id}
              className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="p-1 h-full">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  comparePrice={product.comparePrice}
                  image={primaryImage}
                  rating={avgRating}
                  reviewCount={product.reviews?.length || 0}
                  status={product.status}
                  category={product.category || undefined}
                  inStock={inStock}
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </div>
    </Carousel>
  );
}
