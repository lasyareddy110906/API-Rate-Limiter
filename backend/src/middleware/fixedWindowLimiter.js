const requestStore = {};

export const fixedWindowLimiter = (limit, windowMs) => {
  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    // First request from this IP
    if (!requestStore[ip]) {
      requestStore[ip] = {
        count: 1,
        startTime: currentTime,
      };

      res.set({
        "X-RateLimit-Limit": limit,
        "X-RateLimit-Remaining": limit - 1,
        "X-RateLimit-Reset": Math.ceil(windowMs / 1000),
      });

      return next();
    }

    const timePassed =
      currentTime - requestStore[ip].startTime;

    // Reset window after time expires
    if (timePassed > windowMs) {
      requestStore[ip] = {
        count: 1,
        startTime: currentTime,
      };

      res.set({
        "X-RateLimit-Limit": limit,
        "X-RateLimit-Remaining": limit - 1,
        "X-RateLimit-Reset": Math.ceil(windowMs / 1000),
      });

      return next();
    }

    // Increase request count
    requestStore[ip].count++;

    // Remaining requests
    const remainingRequests =
      limit - requestStore[ip].count;

    // Response headers
    res.set({
      "X-RateLimit-Limit": limit,
      "X-RateLimit-Remaining": Math.max(
        remainingRequests,
        0
      ),
      "X-RateLimit-Reset": Math.ceil(
        (windowMs - timePassed) / 1000
      ),
    });

    // Block if limit exceeded
    if (requestStore[ip].count > limit) {
      return res.status(429).json({
        success: false,
        message:
          "Too many requests. Try again later.",
      });
    }

    next();
  };
};