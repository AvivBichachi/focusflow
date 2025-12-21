import { getCurrentFocus, startFocus as startFocusService, stopFocus as stopFocusService } from "../services/focus.service.js";

export function getFocus(req, res) {
  const focus = getCurrentFocus();
  res.status(200).json(focus);
}

export function startFocus(req, res) {
  const { taskId } = req.body ?? {};

  if (!taskId || typeof taskId !== "string") {
    return res.status(400).json({ error: "taskId is required and must be a string" });
  }

  const result = startFocusService(taskId);

  if (!result.ok && result.error === "FOCUS_ALREADY_ACTIVE") {
    return res.status(400).json({ error: "A task is already in focus" });
  }

  res.status(200).json(result.focus);
}

export function stopFocus(req, res) {
  const result = stopFocusService();

  if (!result.ok && result.error === "NO_ACTIVE_FOCUS") {
    return res.status(400).json({ error: "No task is currently in focus" });
  }

  res.status(200).json({ message: "Focus stopped" });
}
