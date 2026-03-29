import express from "express";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import { getDB } from "./db.js";

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Healthcheck (for you, for CI, for uptime monitors)
app.get("/api/health", async (req, res) => {
  await getDB();
  res.json({ ok: true, uptime: process.uptime() });
});

// Routes (префиксы монтирования)
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "NotFound" });
});

// Global error handler (so the app never crashes on thrown errors)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: "ServerError" });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
