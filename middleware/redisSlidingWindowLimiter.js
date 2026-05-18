import client from "../config/redis.js";

export const redisSlidingWindowLimiter = (
  limit,
  windowMs
) => {
  return async (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    const key = `rate-limit:${ip}`;

    try {
      // Get existing timestamps
      const data = await client.get(key);

      let timestamps = data
        ? JSON.parse(data)
        : [];

      // Remove expired timestamps
      timestamps = timestamps.filter(
        (timestamp) =>
          currentTime - timestamp < windowMs
      );

      // Check limit
      if (timestamps.length >= limit) {
        return res.status(429).json({
          success: false,
          message:
            "Too many requests (Redis limiter).",
        });
      }

      // Add current request
      timestamps.push(currentTime);

      // Store back in Redis
      await client.set(
        key,
        JSON.stringify(timestamps)
      );

      // Auto-expire key
      await client.expire(
        key,
        Math.ceil(windowMs / 1000)
      );

      next();
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Redis error",
      });
    }
  };
};