import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function register({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const passwordHash = await bcrypt.hash(password, 12);

  const { rows } = await pool.query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email
    `,
    [normalizedEmail, passwordHash]
  );

  const user = rows[0];
  return { user, token: signToken(user) };
}

export async function login({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const { rows } = await pool.query(
    `
    SELECT id, email, password_hash
    FROM users
    WHERE email = $1
    LIMIT 1
    `,
    [normalizedEmail]
  );

  const user = rows[0];
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;

  return { user: { id: user.id, email: user.email }, token: signToken(user) };
}

function signToken(user) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { subject: user.id, expiresIn }
  );
}
