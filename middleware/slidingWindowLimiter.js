const requestLogs = {};

export const slidingWindowLimiter = (limit, windowMs) => {
  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    // Create array for new IP
    if (!requestLogs[ip]) {
      requestLogs[ip] = [];
    }

    // Remove expired timestamps
    requestLogs[ip] = requestLogs[ip].filter(
      (timestamp) =>
        currentTime - timestamp < windowMs
    );

    // Check request count
    if (requestLogs[ip].length >= limit) {
      return res.status(429).json({
        success: false,
        message:
          "Too many requests. Try again later.",
      });
    }

    // Store current request timestamp
    requestLogs[ip].push(currentTime);

    // Headers
    res.set({
      "X-RateLimit-Limit": limit,
      "X-RateLimit-Remaining":
        limit - requestLogs[ip].length,
    });

    next();
  };
};