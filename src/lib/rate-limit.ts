import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return async function (req: NextRequest) {
    const ip = req.ip || 'anonymous';
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up expired entries
    for (const [key, value] of Array.from(rateLimitStore.entries())) {
      if (value.resetTime < windowStart) {
        rateLimitStore.delete(key);
      }
    }

    // Get or create rate limit entry
    const entry = rateLimitStore.get(ip) || {
      count: 0,
      resetTime: now + config.windowMs,
    };

    // Check if rate limit is exceeded
    if (entry.count >= config.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }

    // Update rate limit entry
    entry.count++;
    rateLimitStore.set(ip, entry);

    return null;
  };
}

// Default rate limit configuration
export const defaultRateLimit = rateLimit({
  maxRequests: 5, // 5 requests
  windowMs: 60 * 1000, // per minute
});
