import { apiFetch } from "./http";

// Tasks
export async function listTasks() {
  return apiFetch("/api/tasks");
}

export async function createTask(payload) {
  return apiFetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(taskId) {
  return apiFetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function updateTask(taskId, updates) {
  return apiFetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function completeTask(taskId) {
  return apiFetch(`/api/tasks/${taskId}/complete`, {
    method: "POST",
  });
}

// Focus
export async function getFocus() {
  return apiFetch("/api/focus");
}

export async function startFocus(taskId) {
  return apiFetch("/api/focus/start", {
    method: "POST",
    body: JSON.stringify({ taskId }),
  });
}

export async function stopFocus() {
  return apiFetch("/api/focus/stop", {
    method: "POST",
  });
}
