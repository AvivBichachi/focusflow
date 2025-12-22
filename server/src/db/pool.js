import { Pool } from "pg";

const {
  PGHOST = "localhost",
  PGPORT = "5432",
  PGDATABASE = "focusflow",
  PGUSER = "focusflow",
  PGPASSWORD,
} = process.env;

if (!PGPASSWORD) {
  throw new Error("Missing PGPASSWORD for PostgreSQL connection");
}

export const pool = new Pool({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});
