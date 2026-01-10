import { pool } from "../db/pool.js";

function clampInt(value, { min, max, fallback }) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function parseIsoDateOrNull(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * List focus sessions for the authenticated user.
 *
 * @param {string} userId
 * @param {{limit?: number|string, taskId?: string, from?: string, to?: string}} filters
 * @returns {Promise<Array<{id:string, taskId:string, taskTitle:string|null, startedAt:string, endedAt:string|null, durationSeconds:number|null}>>}
 */
export async function listFocusSessions(userId, { limit, taskId, from, to } = {}) {
  const safeLimit = clampInt(limit, { min: 1, max: 100, fallback: 20 });

  const where = [];
  const values = [];
  let idx = 1;

  // Ownership fence (always)
  where.push(`fs.user_id = $${idx++}`);
  values.push(userId);

  if (taskId) {
    // Keep it consistent with ownership (task must belong to same user)
    where.push(`fs.task_id = $${idx++}`);
    values.push(taskId);
  }

  const fromDate = parseIsoDateOrNull(from);
  if (from && !fromDate) {
    const err = new Error("Invalid 'from' date. Must be ISO-8601.");
    err.status = 400;
    throw err;
  }
  if (fromDate) {
    where.push(`fs.started_at >= $${idx++}`);
    values.push(fromDate.toISOString());
  }

  const toDate = parseIsoDateOrNull(to);
  if (to && !toDate) {
    const err = new Error("Invalid 'to' date. Must be ISO-8601.");
    err.status = 400;
    throw err;
  }
  if (toDate) {
    where.push(`fs.started_at <= $${idx++}`);
    values.push(toDate.toISOString());
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // We join tasks to show the title, and also fence ownership on tasks for safety.
  // (Even though fs.user_id already fences, this keeps it robust if data ever becomes inconsistent.)
  const { rows } = await pool.query(
    `
    SELECT
      fs.id,
      fs.task_id,
      t.title AS task_title,
      fs.started_at,
      fs.ended_at,
      CASE
        WHEN fs.ended_at IS NULL THEN NULL
        ELSE EXTRACT(EPOCH FROM (fs.ended_at - fs.started_at))::int
      END AS duration_seconds
    FROM focus_sessions fs
    JOIN tasks t
      ON t.id = fs.task_id
     AND t.user_id = $1
    ${whereSql}
    ORDER BY fs.started_at DESC
    LIMIT $${idx}
    `,
    [...values, safeLimit]
  );

  return rows.map((r) => ({
    id: r.id,
    taskId: r.task_id,
    taskTitle: r.task_title ?? null,
    startedAt: new Date(r.started_at).toISOString(),
    endedAt: r.ended_at ? new Date(r.ended_at).toISOString() : null,
    durationSeconds: r.duration_seconds,
  }));
}

/**
 * Daily focus stats (sum of focused seconds per day) for the authenticated user.
 *
 * @param {string} userId
 * @param {{days?: number|string, tz?: string}} params
 * @returns {Promise<Array<{date:string, totalSeconds:number}>>}
 */
export async function getDailyFocusStats(userId, { days, tz } = {}) {
  const nDays = Number(days);
  const safeDays = Number.isFinite(nDays) ? Math.min(Math.max(Math.trunc(nDays), 1), 30) : 7;

  const safeTz = typeof tz === "string" && tz.trim() ? tz.trim() : "UTC";
  if (safeTz.length > 64) {
    const err = new Error("Invalid 'tz' value");
    err.status = 400;
    throw err;
  }

  // We compute the local-day window in the requested timezone.
  // Start day = (today in tz) - (days - 1)
  // Then treat it as midnight in tz and convert to timestamptz boundary.
  const { rows } = await pool.query(
    `
    SELECT
      to_char(timezone($2, fs.started_at), 'YYYY-MM-DD') AS day,
      COALESCE(SUM(EXTRACT(EPOCH FROM (fs.ended_at - fs.started_at)))::int, 0) AS total_seconds
    FROM focus_sessions fs
    WHERE
      fs.user_id = $3
      AND fs.ended_at IS NOT NULL
      AND fs.started_at >= (
        ((timezone($2, now())::date - ($1 - 1))::timestamp AT TIME ZONE $2)
      )
    GROUP BY to_char(timezone($2, fs.started_at), 'YYYY-MM-DD')
    ORDER BY day DESC
    `,
    [safeDays, safeTz, userId]
  );

  return rows.map((r) => ({
    date: r.day,
    totalSeconds: r.total_seconds ?? 0,
  }));
}
