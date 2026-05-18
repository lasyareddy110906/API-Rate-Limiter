import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Rate Limiter Running ");
});

app.get("/api", (req, res) => {
  res.send("API Route Working");
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});