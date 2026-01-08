import express from "express";
import { createTask, listTasks, updateTask, completeTask, deleteTask } from "../controllers/tasks.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

// POST /api/tasks
router.post("/", createTask);

// GET /api/tasks
router.get("/", listTasks);

// PATCH /api/tasks/:id
router.patch("/:id", updateTask);

// POST /api/tasks/:id/complete
router.post("/:id/complete", completeTask);

// DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

export default router;
