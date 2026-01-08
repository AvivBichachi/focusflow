import { login as loginService, register as registerService } from "../services/auth.service.js";

export async function register(req, res) {
  const { email, password } = req.body || {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "email is required and must be a string" });
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "password is required (min 8 chars)" });
  }

  try {
    const { user, token } = await registerService({ email, password });
    return res.status(201).json({ user, token });
  } catch (err) {
    // Unique violation (email exists)
    if (err?.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    console.error("Failed to register", err);
    return res.status(500).json({ error: "Failed to register" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "email is required and must be a string" });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "password is required" });
  }

  try {
    const result = await loginService({ email, password });
    if (!result) return res.status(401).json({ error: "Invalid credentials" });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Failed to login", err);
    return res.status(500).json({ error: "Failed to login" });
  }
}
