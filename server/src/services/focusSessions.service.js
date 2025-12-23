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

export async function listFocusSessions({ limit, taskId, from, to }) {
    const safeLimit = clampInt(limit, { min: 1, max: 100, fallback: 20 });

    const where = [];
    const values = [];
    let idx = 1;

    if (taskId) {
        where.push(`task_id = $${idx++}`);
        values.push(taskId);
    }

    const fromDate = parseIsoDateOrNull(from);
    if (from && !fromDate) {
        const err = new Error("Invalid 'from' date. Must be ISO-8601.");
        err.status = 400;
        throw err;
    }
    if (fromDate) {
        where.push(`started_at >= $${idx++}`);
        values.push(fromDate.toISOString());
    }

    const toDate = parseIsoDateOrNull(to);
    if (to && !toDate) {
        const err = new Error("Invalid 'to' date. Must be ISO-8601.");
        err.status = 400;
        throw err;
    }
    if (toDate) {
        where.push(`started_at <= $${idx++}`);
        values.push(toDate.toISOString());
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await pool.query(
        `
    SELECT
        fs.id,
        fs.task_id,
        t.title AS task_title,
        fs.started_at,
        fs.ended_at,
        EXTRACT(EPOCH FROM (fs.ended_at - fs.started_at))::int AS duration_seconds

    FROM focus_sessions fs
    JOIN tasks t ON t.id = fs.task_id

    ${whereSql}
    ORDER BY started_at DESC
    LIMIT $${idx}
    `,
        [...values, safeLimit]
    );

    return rows.map((r) => ({
        id: r.id,
        taskId: r.task_id,
        taskTitle: r.task_title,
        startedAt: new Date(r.started_at).toISOString(),
        endedAt: r.ended_at ? new Date(r.ended_at).toISOString() : null,
        durationSeconds: r.ended_at ? r.duration_seconds : null,
    }));
}

export async function getDailyFocusStats({ days, tz }) {
    const safeDays = Number.isInteger(Number(days))
        ? Math.min(Math.max(Number(days), 1), 30)
        : 7;

    const safeTz = typeof tz === "string" && tz.trim() ? tz.trim() : "UTC";
    if (safeTz.length > 64) {
        const err = new Error("Invalid 'tz' value");
        err.status = 400;
        throw err;
    }

    const { rows } = await pool.query(
        `
    SELECT
  to_char(timezone($2, started_at), 'YYYY-MM-DD') AS day,
  SUM(EXTRACT(EPOCH FROM (ended_at - started_at)))::int AS total_seconds
FROM focus_sessions
WHERE
  ended_at IS NOT NULL
  AND started_at >= (now() - ($1 || ' days')::interval)
GROUP BY to_char(timezone($2, started_at), 'YYYY-MM-DD')
ORDER BY day DESC

    `,
        [safeDays, safeTz]
    );

    return rows.map((r) => ({
        date: r.day,
        totalSeconds: r.total_seconds ?? 0,
    }));
}

