let currentFocus = {
  taskId: null,
  focusedAt: null,
};

export function getCurrentFocus() {
  return { ...currentFocus };
}

export function startFocus(taskId) {
  if (currentFocus.taskId) {
    return { ok: false, error: "FOCUS_ALREADY_ACTIVE" };
  }

  currentFocus = {
    taskId,
    focusedAt: new Date().toISOString(),
  };

  return { ok: true, focus: { ...currentFocus } };
}

export function stopFocus() {
  if (!currentFocus.taskId) {
    return { ok: false, error: "NO_ACTIVE_FOCUS" };
  }

  currentFocus = { taskId: null, focusedAt: null };
  return { ok: true };
}
