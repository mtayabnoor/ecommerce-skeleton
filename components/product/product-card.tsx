'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { ProductPrice } from './product-price';
import { Product } from '@/types';

function ProductCard({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const tags: string[] = [];
  if (product.isFeatured) tags.push('New');
  if (product.stock === 0) tags.push('Sold out');
  if (product.stock > 0 && product.stock <= 5) tags.push('Few left');

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div className="group relative flex flex-col">
      {/* Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          {product.images.length > 0 ? (
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">No image</span>
            </div>
          )}
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-[18px] w-[18px] transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none text-foreground'
            }`}
          />
        </button>

        {/* Tag Badges */}
        {tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-foreground text-background px-2 py-0.5 text-[11px] font-semibold leading-tight"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Variant Thumbnails */}
      {product.images.length > 1 && (
        <div className="mt-2 flex items-center gap-1.5">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`relative h-10 w-8 overflow-hidden border transition-all ${
                activeImage === i
                  ? 'border-foreground'
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} variant ${i + 1}`}
                fill
                sizes="32px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Info */}
      <div className="mt-2.5 flex flex-col gap-0.5">
        {/* Brand */}
        <Link
          href={`/product/${product.slug}`}
          className="transition-colors hover:underline"
        >
          <p className="text-sm font-bold leading-snug text-foreground">
            {product.brand}
          </p>
        </Link>

        {/* Product Name */}
        <p className="text-sm leading-snug text-muted-foreground line-clamp-1">
          {product.name}
        </p>

        {/* Price */}
        <div className="mt-1">
          <ProductPrice value={product.price} className="font-bold" />
        </div>
      </div>
    </div>
  );
}

export { ProductCard };
