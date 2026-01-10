import { pool } from "../db/pool.js";

export async function getCurrentFocus(userId) {
  const { rows } = await pool.query(
    `
    SELECT id, task_id, started_at
    FROM focus_sessions
    WHERE user_id = $1 AND ended_at IS NULL
    ORDER BY started_at DESC
    LIMIT 1
    `,
    [userId]
  );

  const s = rows[0];
  if (!s) return { taskId: null, focusedAt: null };

  return {
    taskId: s.task_id,
    focusedAt: new Date(s.started_at).toISOString(),
    sessionId: s.id,
  };
}

export async function startFocus(userId, taskId) {
  // fast path: check existing active session for this user
  const existing = await getCurrentFocus(userId);
  if (existing.taskId) {
    return { ok: false, error: "FOCUS_ALREADY_ACTIVE" };
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO focus_sessions (user_id, task_id)
      VALUES ($1, $2)
      RETURNING id, task_id, started_at
      `,
      [userId, taskId]
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
    // unique index (user_id) WHERE ended_at IS NULL
    if (err?.code === "23505") {
      return { ok: false, error: "FOCUS_ALREADY_ACTIVE" };
    }
    throw err;
  }
}

export async function stopFocus(userId) {
  const { rows } = await pool.query(
    `
    UPDATE focus_sessions
    SET ended_at = now()
    WHERE user_id = $1 AND ended_at IS NULL
    RETURNING id
    `,
    [userId]
  );

  if (rows.length === 0) {
    return { ok: false, error: "NO_ACTIVE_FOCUS" };
  }

  return { ok: true };
}
