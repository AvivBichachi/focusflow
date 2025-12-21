import express from "express";
import { startFocus, stopFocus, getFocus } from "../controllers/focus.controller.js";

const router = express.Router();

router.post("/start", startFocus);
router.post("/stop", stopFocus);
router.get("/", getFocus);

export default router;
