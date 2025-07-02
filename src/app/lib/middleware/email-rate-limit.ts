import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'ioredis';
import { rateLimiter } from './rate-limit';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Rate limit configuration for email-related endpoints
const emailRateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 requests per hour
  keyPrefix: 'email_rate_limit:',
  blockDuration: 24 * 60 * 60 * 1000, // 24 hours
};

export async function withEmailRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  req: NextRequest
): Promise<NextResponse> {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const key = `${emailRateLimitConfig.keyPrefix}${ip}`;

  // Check if IP is blocked
  const isBlocked = await redis.get(`${key}:blocked`);
  if (isBlocked) {
    return NextResponse.json(
      {
        error: 'Too many email requests. Please try again later.',
      },
      { status: 429 }
    );
  }

  // Get current request count
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, emailRateLimitConfig.windowMs / 1000);
  }

  // Check if rate limit exceeded
  if (count > emailRateLimitConfig.maxRequests) {
    // Block IP for 24 hours
    await redis.set(`${key}:blocked`, '1', 'EX', emailRateLimitConfig.blockDuration / 1000);

    return NextResponse.json(
      {
        error: 'Too many email requests. Please try again later.',
      },
      { status: 429 }
    );
  }

  // Proceed with the request
  return handler(req);
}
