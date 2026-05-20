const buckets = {};

export const leakyBucketLimiter = (
  bucketSize,
  leakRate,
  leakIntervalMs
) => {
  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    // Create bucket for new IP
    if (!buckets[ip]) {
      buckets[ip] = {
        water: 0,
        lastLeak: currentTime,
      };
    }

    const bucket = buckets[ip];

    // Calculate leaked requests
    const timePassed =
      currentTime - bucket.lastLeak;

    const leakedRequests = Math.floor(
      timePassed / leakIntervalMs
    ) * leakRate;

    // Reduce water level
    if (leakedRequests > 0) {
      bucket.water = Math.max(
        0,
        bucket.water - leakedRequests
      );

      bucket.lastLeak = currentTime;
    }

    // Bucket full
    if (bucket.water >= bucketSize) {
      return res.status(429).json({
        success: false,
        message:
          "Too many requests. Bucket overflow.",
      });
    }

    // Add request to bucket
    bucket.water++;

    // Headers
    res.set({
      "X-RateLimit-Limit": bucketSize,
      "X-RateLimit-Remaining":
        bucketSize - bucket.water,
    });

    next();
  };
};