export type TokenBucketConfig = {
  capacity: number;
  refillTokensPerMs: number;
};

export type RateLimiterConfig = {
  type: "token-bucket";
  tokenBucket: TokenBucketConfig;
};
