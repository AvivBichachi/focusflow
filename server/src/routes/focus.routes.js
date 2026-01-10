import express from "express";
import { startFocus, stopFocus, getFocus, getFocusSessions, getDailyFocusStats, } from "../controllers/focus.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/start", startFocus);
router.post("/stop", stopFocus);
router.get("/", getFocus);
router.get("/sessions", getFocusSessions);
router.get("/stats/daily", getDailyFocusStats);

export default router;
