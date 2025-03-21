
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  priority?: boolean;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  className,
  delay = 0,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Simulate preloading
  useEffect(() => {
    if (!isInView && !priority) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setTimeout(() => {
        setIsLoaded(true);
      }, delay);
    };
  }, [isInView, src, delay, priority]);

  return (
    <div className="relative overflow-hidden">
      <div className={cn("relative transition-all duration-700", className)}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-md",
          isLoaded ? "opacity-0" : "opacity-100"
        )} />
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm",
            className
          )}
        />
      </div>
    </div>
  );
};

export default AnimatedImage;
