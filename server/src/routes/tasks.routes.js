import express from "express";
import { createTask, listTasks } from "../controllers/tasks.controller.js";

const router = express.Router();

// POST /api/tasks
router.post("/", createTask);

// GET /api/tasks
router.get("/", listTasks);

export default router;
