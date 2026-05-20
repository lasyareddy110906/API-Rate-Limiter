const tokenBuckets = {};

export const tokenBucketLimiter = (
  bucketSize,
  refillRate,
  refillTimeMs
) => {
  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    // Create bucket for new IP
    if (!tokenBuckets[ip]) {
      tokenBuckets[ip] = {
        tokens: bucketSize,
        lastRefill: currentTime,
      };
    }

    const bucket = tokenBuckets[ip];

    // Calculate elapsed time
    const timePassed =
      currentTime - bucket.lastRefill;

    // Calculate tokens to refill
    const refillTokens = Math.floor(
      timePassed / refillTimeMs
    ) * refillRate;

    // Refill bucket
    if (refillTokens > 0) {
      bucket.tokens = Math.min(
        bucketSize,
        bucket.tokens + refillTokens
      );

      bucket.lastRefill = currentTime;
    }

    // No tokens left
    if (bucket.tokens <= 0) {
      return res.status(429).json({
        success: false,
        message:
          "Too many requests. Token bucket empty.",
      });
    }

    // Consume token
    bucket.tokens--;

    // Headers
    res.set({
      "X-RateLimit-Limit": bucketSize,
      "X-RateLimit-Remaining": bucket.tokens,
    });

    next();
  };
};