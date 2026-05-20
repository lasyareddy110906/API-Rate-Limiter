import { createClient } from "redis";

const client = createClient({
  url: "redis://127.0.0.1:6379",
});

client.on("connect", () => {
  console.log("✅ Redis Connected");
});

client.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});

export default client;