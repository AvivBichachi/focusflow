import express from "express";
import cors from "cors";
import tasksRoutes from "./src/routes/tasks.routes.js";
import focusRoutes from "./src/routes/focus.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", tasksRoutes);
app.use("/api/focus", focusRoutes);


app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
