
import { useEffect, useState, lazy, LazyExoticComponent } from 'react';

// Debounce function for performance optimization
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Throttle function to limit execution rate
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let lastTime = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    const now = Date.now();
    const timePassed = now - lastTime;
    
    if (timePassed >= waitFor) {
      lastTime = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        func(...args);
      }, waitFor - timePassed);
    }
  };
};

// Memoize function for caching expensive calculations
export function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<T, R>();
  return (arg: T): R => {
    if (cache.has(arg)) {
      return cache.get(arg) as R;
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// Hook for detecting if the component is visible in viewport
export const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin = "0px") => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, rootMargin]);

  return isVisible;
};

// Preload lazy loaded components to reduce delay
export const preloadComponent = <T extends React.ComponentType<any>>(
  LazyComponent: LazyExoticComponent<T>
) => {
  try {
    // This cast addresses the TypeScript error as we know the internal structure
    const component = LazyComponent as unknown as { _payload: { _status: number; _result: T } };
    
    // Only trigger a load if the component hasn't been loaded yet
    if (component && component._payload && component._payload._status === -1) {
      // This will force React to start loading the component
      Promise.resolve().then(() => {
        const importPromise = (component as any)._init(component._payload);
        return importPromise;
      });
    }
  } catch (e) {
    console.error('Error preloading component:', e);
  }
};

// Image optimization - preload important images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Batch DOM updates for performance
export const batchDOMUpdates = (callback: () => void) => {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(() => {
      callback();
    });
  } else {
    setTimeout(callback, 0);
  }
};

// Cache API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute in milliseconds

export const cachedFetch = async (url: string, options?: RequestInit) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const now = Date.now();
  const cached = apiCache.get(cacheKey);
  
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  apiCache.set(cacheKey, {
    data,
    timestamp: now
  });
  
  return data;
};

// Dynamic import with retry
export const retryImport = async (
  importFn: () => Promise<any>,
  retries = 3,
  delay = 1000
): Promise<any> => {
  try {
    return await importFn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryImport(importFn, retries - 1, delay * 2);
  }
};
