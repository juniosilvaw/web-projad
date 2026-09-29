import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

export const bannersRouter = Router();

const bannerSchema = z.object({
  titulo: z.string().max(220).optional(),
  subtitulo: z.string().max(300).optional(),
  imagem_url: z.string().url(),
  link_url: z.string().url().optional(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

bannersRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM banners WHERE ativo = true ORDER BY ordem");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

bannersRouter.post("/", autenticar, exigirPapel("administrador"), async (req, res, next) => {
  try {
    const dados = bannerSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO banners (titulo, subtitulo, imagem_url, link_url, ordem)
       VALUES ($1, $2, $3, $4, COALESCE($5, 0)) RETURNING *`,
      [dados.titulo ?? null, dados.subtitulo ?? null, dados.imagem_url, dados.link_url ?? null, dados.ordem]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

bannersRouter.put("/:id", autenticar, exigirPapel("administrador"), async (req, res, next) => {
  try {
    const dados = bannerSchema.partial().parse(req.body);
    const campos = Object.keys(dados);
    if (campos.length === 0) throw new AppError("Nenhum campo para atualizar.", 422);

    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const valores = campos.map((c) => (dados as any)[c]);

    const { rows } = await pool.query(
      `UPDATE banners SET ${sets} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!rows[0]) throw new AppError("Banner não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

bannersRouter.delete("/:id", autenticar, exigirPapel("administrador"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM banners WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Banner não encontrado.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
