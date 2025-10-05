'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  priority = false,
  fallbackSrc = '/images/fallback/hotel-placeholder.jpg'
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // If both original and fallback fail, show a gradient placeholder
  if (isError && imgSrc === fallbackSrc) {
    return (
      <div 
        className={`bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-2">🏨</div>
          <div className="text-sm opacity-80">Hotel Image</div>
        </div>
      </div>
    );
  }

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    priority,
    sizes: fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined,
    ...(fill ? { fill: true } : { width, height })
  };

  return <Image {...imageProps} />;
} 