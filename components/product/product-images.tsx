'use client';

import Image from 'next/image';
import { useState } from 'react';

function ProductImages({ images, name }: { images: string[]; name: string }) {
  const [activeImage, setActiveImage] = useState(0);
  return (
    <div className="flex flex-col md:flex-row space-y-4">
      <Image
        src={images[activeImage]}
        alt={name}
        width={500}
        height={500}
        className="min-h-[300px] object-cover object-center"
      />
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-col space-y-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`border cursor-pointer hover:border-black ${
                activeImage === i ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image
                src={img}
                alt={`${name} - Image ${i + 1}`}
                width={300}
                height={300}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { ProductImages };
