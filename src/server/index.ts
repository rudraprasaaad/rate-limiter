import { RateLimiterFactory } from "../factory/rate-limiter-factory";

const rateLimiter = RateLimiterFactory.create({
  type: "token-bucket",
  tokenBucket: {
    capacity: 10,
    refillTokensPerMs: 0.01,
  },
});

Bun.serve({
  port: 3000,

  fetch(req) {
    const key =
      req.headers.get("x-client-id") ??
      req.headers.get("x-forwarded-for") ??
      "anonymous";

    const result = rateLimiter.allow(key);

    return new Response(JSON.stringify(result, null, 2), {
      status: result.allowed ? 200 : 429,
      headers: {
        "content-type": "application/json",
      },
    });
  },
});

console.log("Rate limiter running on http://localhost:3000");
