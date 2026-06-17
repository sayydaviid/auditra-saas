import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./database/pool.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (request, response) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");

    response.status(200).json({
      status: "ok",
      api: "running",
      database: "connected",
      databaseTime: result.rows[0].database_time,
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.listen(port, () => {
  console.log(`API executando em http://localhost:${port}`);
});