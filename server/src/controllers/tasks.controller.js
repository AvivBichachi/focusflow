import {
  createTask as createTaskService,
  listTasks as listTasksService,
  updateTaskById,
  completeTaskById,
  deleteTaskById,
} from "../services/tasks.service.js";

export function createTask(req, res) {
  const { title, description, priority, dueDate } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      error: "title is required and must be a string",
    });
  }

  const task = createTaskService({
    title,
    description,
    priority,
    dueDate,
  });

  res.status(201).json(task);
}

export function listTasks(req, res) {
  const tasks = listTasksService();
  res.status(200).json({ items: tasks });
}

export function updateTask(req, res) {
  const { id } = req.params;
  const updates = req.body;

  if (updates.status && updates.status === "COMPLETED") {
    return res.status(400).json({
      error: "Use the /complete endpoint to complete a task",
    });
  }

  const updatedTask = updateTaskById(id, updates);
  if (!updatedTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(updatedTask);
}


export function completeTask(req, res) {
  const { id } = req.params;

  const task = completeTaskById(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
}


export function deleteTask(req, res) {
  const { id } = req.params;

  const deleted = deleteTaskById(id);
  if (!deleted) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(204).send();
}

