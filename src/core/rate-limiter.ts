import type { RateLimitResult } from "./rate-limiter-result";

export interface RateLimiter {
  allow(key: string): RateLimitResult;
}
