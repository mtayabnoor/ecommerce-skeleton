'use client';

import Image from 'next/image';
import { useState } from 'react';

function ProductImages({ images, name }: { images: string[]; name: string }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 w-full">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto max-w-full md:w-[72px] shrink-0 pb-2 md:pb-0 hide-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`relative w-16 h-16 md:w-[72px] md:h-[72px] shrink-0 flex-none border overflow-hidden cursor-pointer transition-colors ${
                activeImage === i
                  ? 'border-foreground'
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              <Image
                src={img}
                alt={`${name} - Thumbnail ${i + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative w-full md:w-auto md:flex-1 h-[400px] md:h-[560px] overflow-hidden bg-muted">
        <Image
          src={images[activeImage]}
          alt={name}
          fill
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}

export { ProductImages };
