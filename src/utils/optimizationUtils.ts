
/**
 * Utility functions for application performance optimization
 */

// Image optimization - convert to WebP format and resize
export const optimizeImage = (imageUrl: string, width: number, quality = 80): string => {
  // This is a mock implementation - in a real app, you'd use a CDN or image service
  if (!imageUrl) return imageUrl;
  return `${imageUrl}?width=${width}&quality=${quality}&format=webp`;
};

// Memoize expensive function results
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Debounce function to limit how often a function can fire
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Throttle function to ensure function is called at most once in a specified period
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<F>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Lazy load component for code splitting
export const lazyWithPreload = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  const Component = React.lazy(factory);
  let factoryPromise: Promise<{ default: T }> | null = null;
  
  const load = () => {
    if (!factoryPromise) {
      factoryPromise = factory();
    }
    return factoryPromise;
  };
  
  Component.preload = load;
  
  return Component;
};

// Performance measurement utility
export const measurePerformance = (label: string) => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    console.log(`${label} took ${end - start}ms`);
  };
};

