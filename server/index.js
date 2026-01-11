import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.routes.js";
import tasksRoutes from "./src/routes/tasks.routes.js";
import focusRoutes from "./src/routes/focus.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/focus", focusRoutes);

// Health check for Render
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Serve React build (client/dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../client/dist");

app.use(express.static(clientDistPath));

// SPA fallback (React Router):
// Match any route that DOES NOT start with /api
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
