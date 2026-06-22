import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não encontrada no backend/.env");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});