import { pool } from "../db/pool.js";

export async function getCurrentFocus() {
  const { rows } = await pool.query(
    `
    SELECT id, task_id, started_at
    FROM focus_sessions
    WHERE ended_at IS NULL
    ORDER BY started_at DESC
    LIMIT 1
    `
  );

  const s = rows[0];
  if (!s) return { taskId: null, focusedAt: null };

  return {
    taskId: s.task_id,
    focusedAt: new Date(s.started_at).toISOString(),
    sessionId: s.id,
  };
}

export async function startFocus(taskId) {
  // Check if already active (fast path)
  const existing = await getCurrentFocus();
  if (existing.taskId) {
    return { ok: false, error: "FOCUS_ALREADY_ACTIVE" };
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO focus_sessions (task_id)
      VALUES ($1)
      RETURNING id, task_id, started_at
      `,
      [taskId]
    );

    const s = rows[0];
    return {
      ok: true,
      focus: {
        taskId: s.task_id,
        focusedAt: new Date(s.started_at).toISOString(),
        sessionId: s.id,
      },
    };
  } catch (err) {
    // Unique index will throw if a session is already active (race-safe)
    if (err?.code === "23505") {
      return { ok: false, error: "FOCUS_ALREADY_ACTIVE" };
    }
    throw err;
  }
}

export async function stopFocus() {
  const { rows } = await pool.query(
    `
    UPDATE focus_sessions
    SET ended_at = now()
    WHERE ended_at IS NULL
    RETURNING id
    `
  );

  if (rows.length === 0) {
    return { ok: false, error: "NO_ACTIVE_FOCUS" };
  }

  return { ok: true };
}
