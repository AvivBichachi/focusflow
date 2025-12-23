import express from "express";
import { startFocus, stopFocus, getFocus, getFocusSessions, getDailyFocusStats, } from "../controllers/focus.controller.js";

const router = express.Router();

router.post("/start", startFocus);
router.post("/stop", stopFocus);
router.get("/", getFocus);
router.get("/sessions", getFocusSessions);
router.get("/stats/daily", getDailyFocusStats);

export default router;
