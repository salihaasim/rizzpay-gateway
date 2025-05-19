
/**
 * Utility functions for optimizing application performance
 */

// Image optimization
export const getOptimizedImageUrl = (url: string, width?: number, quality?: number): string => {
  if (!url) return '';
  
  // If URL is already optimized or is a data URL, return as is
  if (url.includes('width=') || url.startsWith('data:')) {
    return url;
  }
  
  // Add optimization parameters
  const params = new URLSearchParams();
  if (width) params.append('width', width.toString());
  if (quality) params.append('quality', quality.toString());
  
  // Add format=webp for better compression if supported
  params.append('format', 'webp');
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
};

// Component lazy loading with retry
export const retryLazyImport = (
  importFn: () => Promise<any>,
  retriesLeft = 3,
  interval = 1000
): Promise<any> => {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }
          
          retryLazyImport(importFn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

// Debounce function to limit frequency of function calls
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

// Throttle function to limit rate of execution
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let lastExec = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    const now = Date.now();
    const elapsed = now - lastExec;
    
    const exec = () => {
      lastExec = Date.now();
      func(...args);
    };
    
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    
    if (elapsed > waitFor) {
      exec();
    } else {
      timer = setTimeout(exec, waitFor - elapsed);
    }
  };
};

// Simple memoization for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
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
};

// Preload critical resources
export const preloadResources = (resources: string[]): void => {
  resources.forEach(resource => {
    if (resource.endsWith('.js')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = resource;
      document.head.appendChild(link);
    } else if (resource.match(/\.(png|jpg|jpeg|gif|webp|avif)$/)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
    } else if (resource.match(/\.(css)$/)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = resource;
      document.head.appendChild(link);
    }
  });
};

// Detect browser idle time to load non-critical resources
export const loadWhenIdle = (callback: () => void): void => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1000);
  }
};

// Clean up memory leaks
export const cleanupResources = (resources: { cleanup: () => void }[]): () => void => {
  return () => {
    resources.forEach(resource => {
      if (resource && typeof resource.cleanup === 'function') {
        resource.cleanup();
      }
    });
  };
};
