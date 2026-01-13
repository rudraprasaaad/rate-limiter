import type { RateLimiter } from "../core/rate-limiter";
import { MemoryStore } from "../store/memory-store";
import { TokenBucket } from "../token-bucket/token-bucket";
import type { Algorithm } from "../types/algorithm";
import type { RateLimiterConfig } from "./rate-limiter-config";

export class RateLimiterFactory {
  static create(config: RateLimiterConfig): RateLimiter {
    switch (config.type) {
      case "token-bucket": {
        return new TokenBucket(
          new MemoryStore(),
          config.tokenBucket.capacity,
          config.tokenBucket.refillTokensPerMs,
          () => Date.now()
        );
      }
    }
  }
}
