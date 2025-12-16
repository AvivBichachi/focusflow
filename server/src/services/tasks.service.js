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
