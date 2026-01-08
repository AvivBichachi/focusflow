import { pool } from "../db/pool.js";


// Create a task owned by the authenticated user

export async function createTask(userId, { title, description, priority, dueDate }) {
  const { rows } = await pool.query(
    `
    INSERT INTO tasks (user_id, title, description, status, priority, due_date)
    VALUES ($1, $2, $3, 'TODO', $4, $5)
    RETURNING id, title, description, status, priority, due_date, created_at, updated_at
    `,
    [
      userId,
      title,
      description ?? null,
      priority ?? "MEDIUM",
      dueDate ? new Date(dueDate).toISOString() : null,
    ]
  );

  const t = rows[0];

  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
    createdAt: new Date(t.created_at).toISOString(),
    updatedAt: new Date(t.updated_at).toISOString(),
  };
}


// List tasks for the authenticated user

export async function listTasks(userId) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      status,
      priority,
      due_date,
      created_at,
      updated_at
    FROM tasks
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    priority: r.priority,
    dueDate: r.due_date ? new Date(r.due_date).toISOString() : null,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  }));
}


// Find a specific task by id for the authenticated user

export async function findTaskById(userId, id) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      status,
      priority,
      due_date,
      created_at,
      updated_at
    FROM tasks
    WHERE user_id = $1 AND id = $2
    LIMIT 1
    `,
    [userId, id]
  );

  const t = rows[0];
  if (!t) return null;

  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
    createdAt: new Date(t.created_at).toISOString(),
    updatedAt: new Date(t.updated_at).toISOString(),
  };
}


// Update a task by id for the authenticated user

export async function updateTaskById(userId, id, updates) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(updates.description);
  }
  if (updates.priority !== undefined) {
    fields.push(`priority = $${idx++}`);
    values.push(updates.priority);
  }
  if (updates.dueDate !== undefined) {
    // keep consistent: store timestamptz; accept null to clear
    fields.push(`due_date = $${idx++}`);
    values.push(updates.dueDate ? new Date(updates.dueDate).toISOString() : null);
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(updates.status);
  }

  if (fields.length === 0) return null;

  // Note: we append WHERE params at the end
  const whereUserParam = idx++;
  const whereIdParam = idx++;

  const { rows } = await pool.query(
    `
    UPDATE tasks
    SET ${fields.join(", ")}, updated_at = now()
    WHERE user_id = $${whereUserParam} AND id = $${whereIdParam}
    RETURNING id, title, description, status, priority, due_date, created_at, updated_at
    `,
    [...values, userId, id]
  );

  const t = rows[0];
  if (!t) return null;

  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
    createdAt: new Date(t.created_at).toISOString(),
    updatedAt: new Date(t.updated_at).toISOString(),
  };
}


// Mark task as completed for the authenticated user

export async function completeTaskById(userId, id) {
  const { rows } = await pool.query(
    `
    UPDATE tasks
    SET status = 'COMPLETED', updated_at = now()
    WHERE user_id = $1 AND id = $2
    RETURNING id, title, description, status, priority, due_date, created_at, updated_at
    `,
    [userId, id]
  );

  const t = rows[0];
  if (!t) return null;

  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
    createdAt: new Date(t.created_at).toISOString(),
    updatedAt: new Date(t.updated_at).toISOString(),
  };
}


// Delete task by id for the authenticated user

export async function deleteTaskById(userId, id) {
  const result = await pool.query(
    `
    DELETE FROM tasks
    WHERE user_id = $1 AND id = $2
    `,
    [userId, id]
  );

  return result.rowCount > 0;
}
