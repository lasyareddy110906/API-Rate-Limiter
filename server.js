import express from "express";
import { fixedWindowLimiter } from "./middleware/fixedWindowLimiter.js";
import { slidingWindowLimiter } from "./middleware/slidingWindowLimiter.js";
import { tokenBucketLimiter } from "./middleware/tokenBucketLimiter.js";
import { leakyBucketLimiter } from "./middleware/leakyBucketLimiter.js";
import client from "./config/redis.js";
import { redisSlidingWindowLimiter } from "./middleware/redisSlidingWindowLimiter.js";


const app = express();

app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("API Rate Limiter Running 🚀");
});

// Protected Route
app.get(
  "/api",
  redisSlidingWindowLimiter(5, 60000),
  (req, res) => {
    res.send(
      "Redis Sliding Window Request Successful"
    );
  }
);
const PORT = 9000;

const startServer = async () => {
  try {
    await client.connect();

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();