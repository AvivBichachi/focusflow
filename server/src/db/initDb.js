import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./pool.js";

export async function initDb() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = await fs.readFile(schemaPath, "utf8");

  const client = await pool.connect();
  try {
    console.log("[DB] Initializing schema...");
    await client.query(sql);
    console.log("[DB] Schema ready");
  } finally {
    client.release();
  }
}
