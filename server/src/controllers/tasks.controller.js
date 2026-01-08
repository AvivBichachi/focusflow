import {
  createTask as createTaskService,
  listTasks as listTasksService,
  updateTaskById,
  completeTaskById,
  deleteTaskById,
} from "../services/tasks.service.js";

export async function createTask(req, res) {
  const { title, description, priority, dueDate } = req.body;
  const userId = req.user.id;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required and must be a string" });
  }

  try {
    const task = await createTaskService(userId, { title, description, priority, dueDate });
    res.status(201).json(task);
  } catch (err) {
    console.error("Failed to create task", err);
    res.status(500).json({ error: "Failed to create task" });
  }
}

export async function listTasks(req, res) {
  const userId = req.user.id;

  try {
    const tasks = await listTasksService(userId);
    res.status(200).json({ items: tasks });
  } catch (err) {
    console.error("Failed to list tasks", err);
    res.status(500).json({ error: "Failed to list tasks" });
  }
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.id;

  if (updates.status && updates.status === "COMPLETED") {
    return res.status(400).json({ error: "Use the /complete endpoint to complete a task" });
  }

  const updatedTask = await updateTaskById(userId, id, updates);
  if (!updatedTask) return res.status(404).json({ error: "Task not found" });

  res.status(200).json(updatedTask);
}

export async function completeTask(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const task = await completeTaskById(userId, id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  res.status(200).json(task);
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const deleted = await deleteTaskById(userId, id);
  if (!deleted) return res.status(404).json({ error: "Task not found" });

  res.status(204).send();
}
