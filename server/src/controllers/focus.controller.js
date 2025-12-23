import {
  getCurrentFocus,
  startFocus as startFocusService,
  stopFocus as stopFocusService,
} from "../services/focus.service.js";
import { findTaskById } from "../services/tasks.service.js";
import { getDailyFocusStats as getDailyStatsService, listFocusSessions } from "../services/focusSessions.service.js";


export async function getFocus(req, res) {
  const focus = await getCurrentFocus();
  res.status(200).json(focus);
}

export async function startFocus(req, res) {
  const { taskId } = req.body ?? {};

  if (!taskId || typeof taskId !== "string") {
    return res
      .status(400)
      .json({ error: "taskId is required and must be a string" });
  }

  try {
    const task = await findTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.status === "COMPLETED") {
      return res.status(400).json({ error: "Cannot start focus on a completed task" });
    }


    const result = await startFocusService(taskId);

    if (!result.ok && result.error === "FOCUS_ALREADY_ACTIVE") {
      return res.status(400).json({ error: "A task is already in focus" });
    }

    res.status(200).json(result.focus);
  } catch (err) {
    console.error("Failed to start focus", err);
    res.status(500).json({ error: "Failed to start focus" });
  }
}

export async function stopFocus(req, res) {
  try {
    const result = await stopFocusService();

    if (!result.ok && result.error === "NO_ACTIVE_FOCUS") {
      return res.status(400).json({ error: "No task is currently in focus" });
    }

    res.status(200).json({ message: "Focus stopped" });
  } catch (err) {
    console.error("Failed to stop focus", err);
    res.status(500).json({ error: "Failed to stop focus" });
  }
}

export async function getFocusSessions(req, res) {
  try {
    const { limit, taskId, from, to } = req.query;

    const items = await listFocusSessions({
      limit,
      taskId,
      from,
      to,
    });

    res.status(200).json({ items });
  } catch (err) {
    const status = err.status || 500;
    const message = err.status ? err.message : "Failed to list focus sessions";
    console.error("Failed to list focus sessions", err);
    res.status(status).json({ error: message });
  }
}


export async function getDailyFocusStats(req, res) {
  try {
    const { days, tz } = req.query;

    const items = await getDailyStatsService({ days, tz });

    res.status(200).json({ items });
  } catch (err) {
    console.error("Failed to get daily focus stats", err);
    res.status(500).json({ error: "Failed to get daily focus stats" });
  }
}

