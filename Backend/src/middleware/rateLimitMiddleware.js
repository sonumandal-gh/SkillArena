const rateLimitStore = {};

// Clean up expired IP entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const ip in rateLimitStore) {
    if (now > rateLimitStore[ip].resetTime) {
      delete rateLimitStore[ip];
    }
  }
}, 10 * 60 * 1000);

exports.rateLimiter = (limitCount, windowMs) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    const record = rateLimitStore[ip];

    // If window time passed, reset counter
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count += 1;
    if (record.count > limitCount) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
    }

    next();
  };
};
