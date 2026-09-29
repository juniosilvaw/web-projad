import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

export const midiasRouter = Router();

const midiaSchema = z.object({
  titulo: z.string().min(2).max(220),
  categoria: z.string().min(2).max(80),
  url: z.string().url(),
});

midiasRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM midias ORDER BY publicado_em DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

midiasRouter.post("/", autenticar, exigirPapel("administrador", "editor", "secretaria"), async (req, res, next) => {
  try {
    const dados = midiaSchema.parse(req.body);
    const { rows } = await pool.query(
      "INSERT INTO midias (titulo, categoria, url) VALUES ($1, $2, $3) RETURNING *",
      [dados.titulo, dados.categoria, dados.url]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

midiasRouter.delete("/:id", autenticar, exigirPapel("administrador", "editor"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM midias WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Item de mídia não encontrado.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
