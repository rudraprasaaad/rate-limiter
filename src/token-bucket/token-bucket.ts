import type { Clock } from "../core/clock";
import type { RateLimiter } from "../core/rate-limiter";
import type { RateLimitResult } from "../core/rate-limiter-result";
import type { Store } from "../store/store";
import type { TokenBucketState } from "./token-bucket-state";

export class TokenBucket implements RateLimiter {
  constructor(
    private readonly store: Store<TokenBucketState>,
    private readonly capacity: number,
    private readonly refillTokensPerMs: number,
    private readonly clock: Clock
  ) {}

  allow(key: string): RateLimitResult {
    const now = this.clock();

    const state = this.store.get(key) ?? {
      tokens: this.capacity,
      lastRefillAtMs: now,
    };

    const elapsedMs = now - state.lastRefillAtMs;
    const tokenToAdd = elapsedMs * this.refillTokensPerMs;

    state.tokens = Math.min(this.capacity, state.tokens + tokenToAdd);
    state.lastRefillAtMs = now;

    if (state.tokens >= 1) {
      state.tokens -= 1;
      this.store.set(key, state);

      return {
        allowed: true,
        remaining: Math.floor(state.tokens),
      };
    }

    this.store.set(key, state);

    return {
      allowed: false,
      retryAfterMs: Math.ceil((1 - state.tokens) / this.refillTokensPerMs),
    };
  }
}
