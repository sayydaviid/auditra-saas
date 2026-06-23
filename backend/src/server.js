import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./database/pool.js";
import path from "path";
import { fileURLToPath } from "url";

// Configuração necessária para usar __dirname com ES Modules (import)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- SUAS ROTAS DE API FIQUEM SEMPRE ACIMA DO BLOCO DO FRONTEND ---
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

// --- CONFIGURAÇÃO DO FRONTEND INTEGRADO (VITE) ---

// 1. Serve os arquivos estáticos gerados pelo build do Vite
// Como server.js está em backend/src/, voltamos dois níveis (../../) para achar a pasta dist na raiz
app.use(express.static(path.join(__dirname, "../../dist")));

// 2. Qualquer outra rota que não seja de API (/api/...) vai renderizar o index.html do front
app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "../../dist/index.html"));
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`API executando em http://localhost:${port}`);
});