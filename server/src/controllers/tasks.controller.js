import { createTask as createTaskService, listTasks as listTasksService } from "../services/tasks.service.js";

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
