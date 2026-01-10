import {
  getCurrentFocus,
  startFocus as startFocusService,
  stopFocus as stopFocusService,
} from "../services/focus.service.js";

import { findTaskById } from "../services/tasks.service.js";

import {
  getDailyFocusStats as getDailyStatsService,
  listFocusSessions,
} from "../services/focusSessions.service.js";

function requireUserId(req) {
  const userId = req?.user?.id;
  if (!userId) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return userId;
}

export async function getFocus(req, res) {
  try {
    const userId = requireUserId(req);
    const focus = await getCurrentFocus(userId);
    return res.status(200).json(focus);
  } catch (err) {
    console.error("Failed to get focus", err);
    return res.status(err.status || 500).json({ error: err.message || "Failed to get focus" });
  }
}

export async function startFocus(req, res) {
  const { taskId } = req.body ?? {};

  if (!taskId || typeof taskId !== "string") {
    return res.status(400).json({ error: "taskId is required and must be a string" });
  }

  try {
    const userId = requireUserId(req);

    // Ownership-aware lookup
    const task = await findTaskById(userId, taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.status === "COMPLETED") {
      return res.status(400).json({ error: "Cannot start focus on a completed task" });
    }

    const result = await startFocusService(userId, taskId);

    if (!result.ok && result.error === "FOCUS_ALREADY_ACTIVE") {
      return res.status(409).json({ error: "A focus session is already active" });
    }

    return res.status(200).json(result.focus);
  } catch (err) {
    console.error("Failed to start focus", err);
    return res.status(err.status || 500).json({ error: err.message || "Failed to start focus" });
  }
}

export async function stopFocus(req, res) {
  try {
    const userId = requireUserId(req);

    const result = await stopFocusService(userId);

    if (!result.ok && result.error === "NO_ACTIVE_FOCUS") {
      return res.status(409).json({ error: "No task is currently in focus" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Failed to stop focus", err);
    return res.status(err.status || 500).json({ error: err.message || "Failed to stop focus" });
  }
}

export async function getFocusSessions(req, res) {
  try {
    const userId = requireUserId(req);

    const { limit, taskId, from, to } = req.query;

    const items = await listFocusSessions(userId, { limit, taskId, from, to });

    return res.status(200).json({ items });
  } catch (err) {
    const status = err.status || 500;
    const message = err.status ? err.message : "Failed to list focus sessions";
    console.error("Failed to list focus sessions", err);
    return res.status(status).json({ error: message });
  }
}

export async function getDailyFocusStats(req, res) {
  try {
    const userId = requireUserId(req);

    const { days, tz } = req.query;

    const items = await getDailyStatsService(userId, { days, tz });

    return res.status(200).json({ items });
  } catch (err) {
    console.error("Failed to get daily focus stats", err);
    return res.status(err.status || 500).json({ error: err.message || "Failed to get daily focus stats" });
  }
}
