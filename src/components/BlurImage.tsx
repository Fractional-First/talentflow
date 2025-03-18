
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function BlurImage({ 
  src, 
  alt, 
  className,
  width,
  height
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        isLoading ? 'image-blur-loading' : 'image-blur-loaded',
        'transition-all duration-500 ease-in-out',
        className
      )}
      onLoad={() => setIsLoading(false)}
    />
  );
}
