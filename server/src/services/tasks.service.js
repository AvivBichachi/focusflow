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


export function findTaskById(id) {
  return tasks.find((t) => t.id === id);
}

export function updateTaskById(id, updates) {
  const task = findTaskById(id);
  if (!task) return null;

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.description !== undefined) task.description = updates.description;
  if (updates.priority !== undefined) task.priority = updates.priority;
  if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
  if (updates.status !== undefined) task.status = updates.status;

  task.updatedAt = new Date().toISOString();
  return task;
}

export function completeTaskById(id) {
  const task = findTaskById(id);
  if (!task) return null;

  task.status = "COMPLETED";
  task.updatedAt = new Date().toISOString();
  return task;
}

export function deleteTaskById(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}
