import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'ioredis';
import { dbPool } from '../db/config';

/**
 * Rate limit configuration interface
 */
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
  blockDuration: number;
}

/**
 * Default rate limit configuration
 */
const defaultConfig: RateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  keyPrefix: 'rate-limit:',
  blockDuration: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION || '300000'), // 5 minutes
};

/**
 * Rate limiter class using Redis for distributed rate limiting
 */
export class RateLimiter {
  private redis: Redis;
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }

  /**
   * Generate a rate limit key for a request
   */
  private getKey(req: NextRequest): string {
    const ip = req.ip || 'unknown';
    const path = req.nextUrl.pathname;
    return `${this.config.keyPrefix}${ip}:${path}`;
  }

  /**
   * Check if a request is rate limited
   */
  private async isRateLimited(key: string): Promise<boolean> {
    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, this.config.windowMs / 1000);
    }
    return current > this.config.maxRequests;
  }

  /**
   * Block an IP address
   */
  private async blockIP(ip: string): Promise<void> {
    const blockKey = `${this.config.keyPrefix}block:${ip}`;
    await this.redis.setex(blockKey, this.config.blockDuration / 1000, '1');
  }

  /**
   * Check if an IP is blocked
   */
  private async isIPBlocked(ip: string): Promise<boolean> {
    const blockKey = `${this.config.keyPrefix}block:${ip}`;
    return (await this.redis.exists(blockKey)) === 1;
  }

  /**
   * Rate limit middleware
   */
  public async middleware(req: NextRequest): Promise<NextResponse | null> {
    const ip = req.ip || 'unknown';
    const key = this.getKey(req);

    try {
      // Check if IP is blocked
      if (await this.isIPBlocked(ip)) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Please try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': (this.config.blockDuration / 1000).toString(),
            },
          }
        );
      }

      // Check rate limit
      if (await this.isRateLimited(key)) {
        // Block IP if they exceed rate limit
        await this.blockIP(ip);

        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Please try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': (this.config.blockDuration / 1000).toString(),
            },
          }
        );
      }

      return null;
    } catch (error) {
      // Allow request if rate limiting fails
      return null;
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limit middleware factory
 */
export function withRateLimit(handler: Function) {
  return async function rateLimitedHandler(req: NextRequest) {
    const response = await rateLimiter.middleware(req);
    if (response) {
      return response;
    }
    return handler(req);
  };
}
