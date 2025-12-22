import {
  createTask as createTaskService,
  listTasks as listTasksService,
  updateTaskById,
  completeTaskById,
  deleteTaskById,
} from "../services/tasks.service.js";

export async function createTask(req, res) {
  const { title, description, priority, dueDate } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      error: "title is required and must be a string",
    });
  }

  try {
    const task = await createTaskService({
      title,
      description,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Failed to create task", err);
    res.status(500).json({ error: "Failed to create task" });
  }
}


export async function listTasks(req, res) {
  try {
    const tasks = await listTasksService();
    res.status(200).json({ items: tasks });
  } catch (err) {
    console.error("Failed to list tasks", err);
    res.status(500).json({ error: "Failed to list tasks" });
  }
}


export async function updateTask(req, res) {
  const { id } = req.params;
  const updates = req.body;

  if (updates.status && updates.status === "COMPLETED") {
    return res.status(400).json({
      error: "Use the /complete endpoint to complete a task",
    });
  }

  const updatedTask = await updateTaskById(id, updates);
  if (!updatedTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(updatedTask);
}


export async function completeTask(req, res) {
  const { id } = req.params;

  const task = await completeTaskById(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
}



export async function deleteTask(req, res) {
  const { id } = req.params;

  const deleted = await deleteTaskById(id);
  if (!deleted) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(204).send();
}


