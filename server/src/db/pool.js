import { Pool } from "pg";

const {
  PGHOST = "localhost",
  PGPORT = "5432",
  PGDATABASE = "focusflow",
  PGUSER = "focusflow",
  PGPASSWORD = "admin",
} = process.env;

export const pool = new Pool({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});
