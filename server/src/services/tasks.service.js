import { pool } from "../db/pool.js";


const tasks = [];

export async function createTask({ title, description, priority, dueDate }) {
  const { rows } = await pool.query(
    `
    INSERT INTO tasks (title, description, status, priority, due_date)
    VALUES ($1, $2, 'TODO', $3, $4)
    RETURNING id, title, description, status, priority, due_date, created_at, updated_at
    `,
    [
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


export async function listTasks() {
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
    ORDER BY created_at DESC
    `
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


export async function findTaskById(id) {
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
    WHERE id = $1
    LIMIT 1
    `,
    [id]
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


export async function updateTaskById(id, updates) {
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
    fields.push(`due_date = $${idx++}`);
    values.push(updates.dueDate);
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(updates.status);
  }

  if (fields.length === 0) return null;

  const { rows } = await pool.query(
    `
    UPDATE tasks
    SET ${fields.join(", ")}, updated_at = now()
    WHERE id = $${idx}
    RETURNING id, title, description, status, priority, due_date, created_at, updated_at
    `,
    [...values, id]
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


export async function completeTaskById(id) {
  const { rows } = await pool.query(
    `
    UPDATE tasks
    SET status = 'COMPLETED', updated_at = now()
    WHERE id = $1
    RETURNING id, title, description, status, priority, due_date, created_at, updated_at
    `,
    [id]
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


export function deleteTaskById(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}
