import type { RateLimiter } from "../core/rate-limiter";
import type { RateLimitResult } from "../core/rate-limiter-result";
import type { Store } from "../store/store";

type BucketState = {
  tokens: number;
  lastRefill: number;
};

export class TokenBucket implements RateLimiter {
  constructor(
    private readonly capacity: number,
    private readonly refillRatePerMs: number,
    private readonly store: Store<BucketState>,
    private readonly clock: () => number
  ) {}

  allow(key: string): RateLimitResult {
    const now = this.clock();
    const state = this.store.get(key) ?? {
      tokens: this.capacity,
      lastRefill: now,
    };

    const elapsed = now - state.lastRefill;
    const refill = elapsed * this.refillRatePerMs;

    state.tokens = Math.min(this.capacity, state.tokens + refill);
    state.lastRefill = now;

    if (state.tokens >= 1) {
      state.tokens -= 1;
      this.store.set(key, state);

      return { allowed: true, remaining: Math.floor(state.tokens) };
    }

    const retryAfterMs = Math.ceil((1 - state.tokens) / this.refillRatePerMs);

    this.store.set(key, state);
    return { allowed: false, retryAfterMs };
  }
}
