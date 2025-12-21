import { randomUUID } from "crypto";

const tasks = [];

export function createTask({ title, description, priority, dueDate }) {
  const now = new Date().toISOString();

  const task = {
    id: randomUUID(),
    title,
    description: description ?? null,
    status: "TODO",
    priority: priority ?? "MEDIUM",
    dueDate: dueDate ?? null,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);
  return task;
}

export function listTasks() {
  return tasks;
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
