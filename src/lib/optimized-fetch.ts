'use client';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface FetchOptions {
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
  retries?: number;
  timeout?: number;
  priority?: 'high' | 'low' | 'auto';
  signal?: AbortSignal;
}

class OptimizedCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100;

  set<T>(key: string, data: T, duration: number): void {
    // LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

const globalCache = new OptimizedCache();

// Debounced fetch to prevent excessive API calls
const debouncedFetches = new Map<string, Promise<any>>();

export async function optimizedFetch<T>(
  url: string,
  options: RequestInit & FetchOptions = {}
): Promise<T> {
  const {
    cacheKey = url,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    retries = 3,
    timeout = 10000,
    priority = 'auto',
    signal,
    ...fetchOptions
  } = options;

  // Check cache first
  const cachedData = globalCache.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Check if there's already a pending request for this key
  if (debouncedFetches.has(cacheKey)) {
    return debouncedFetches.get(cacheKey);
  }

  // Create timeout signal
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Combine signals
  const combinedSignal = signal
    ? combineAbortSignals(signal, controller.signal)
    : controller.signal;

  const fetchPromise = performFetch<T>(url, {
    ...fetchOptions,
    signal: combinedSignal,
  }, retries);

  // Store the promise to prevent duplicate requests
  debouncedFetches.set(cacheKey, fetchPromise);

  try {
    const result = await fetchPromise;
    
    // Cache the result
    globalCache.set(cacheKey, result, cacheDuration);
    
    return result;
  } catch (error) {
    // Don't cache errors
    throw error;
  } finally {
    clearTimeout(timeoutId);
    debouncedFetches.delete(cacheKey);
  }
}

async function performFetch<T>(
  url: string,
  options: RequestInit,
  retries: number
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle different content types
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else if (contentType?.includes('text/')) {
        return await response.text() as T;
      } else {
        return await response.blob() as T;
      }
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on abort or client errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      
      if (i < retries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError!;
}

// Utility to combine abort signals
function combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  
  signals.forEach(signal => {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  });
  
  return controller.signal;
}

// Prefetch utility for predictive loading
export function prefetch(
  url: string,
  options: FetchOptions = {}
): void {
  // Use requestIdleCallback for low priority prefetching
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      optimizedFetch(url, { ...options, priority: 'low' }).catch(() => {
        // Silently fail prefetch attempts
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      optimizedFetch(url, { ...options, priority: 'low' }).catch(() => {});
    }, 100);
  }
}

// Batch multiple requests
export async function batchFetch<T>(
  requests: Array<{
    url: string;
    options?: RequestInit & FetchOptions;
  }>
): Promise<Array<T | Error>> {
  const promises = requests.map(({ url, options }) =>
    optimizedFetch<T>(url, options).catch(error => error)
  );

  return Promise.all(promises);
}

// Hook for React components
export function useFetch<T>(
  url: string | null,
  options: FetchOptions = {}
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    optimizedFetch<T>(url, {
      ...options,
      signal: controller.signal,
    })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
}

// Cache management
export const cacheManager = {
  clear: () => globalCache.clear(),
  delete: (key: string) => globalCache.delete(key),
  size: () => globalCache.size(),
  
  // Preload commonly accessed data
  warmUp: async (urls: string[]) => {
    const promises = urls.map(url => 
      prefetch(url, { cacheDuration: 10 * 60 * 1000 })
    );
    await Promise.allSettled(promises);
  },
};

// React import for hooks
import React from 'react';