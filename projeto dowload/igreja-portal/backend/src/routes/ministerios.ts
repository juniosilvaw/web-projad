import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";
import { gerarSlug } from "../utils/slug.js";

export const ministeriosRouter = Router();

const ministerioSchema = z.object({
  nome: z.string().min(2).max(150),
  descricao: z.string().max(2000).optional(),
  lideranca: z.string().max(150).optional(),
  horarios: z.string().max(200).optional(),
  contato: z.string().max(150).optional(),
  foto_url: z.string().url().optional(),
  ativo: z.boolean().optional(),
});

ministeriosRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM ministerios WHERE ativo = true ORDER BY nome"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

ministeriosRouter.get("/:slug", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ministerios WHERE slug = $1", [req.params.slug]);
    if (!rows[0]) throw new AppError("Ministério não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

ministeriosRouter.post("/", autenticar, exigirPapel("administrador", "secretaria"), async (req, res, next) => {
  try {
    const dados = ministerioSchema.parse(req.body);
    const slug = gerarSlug(dados.nome);
    const { rows } = await pool.query(
      `INSERT INTO ministerios (nome, slug, descricao, lideranca, horarios, contato, foto_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [dados.nome, slug, dados.descricao ?? null, dados.lideranca ?? null, dados.horarios ?? null, dados.contato ?? null, dados.foto_url ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

ministeriosRouter.put("/:id", autenticar, exigirPapel("administrador", "secretaria"), async (req, res, next) => {
  try {
    const dados = ministerioSchema.partial().parse(req.body);
    const campos = Object.keys(dados);
    if (campos.length === 0) throw new AppError("Nenhum campo para atualizar.", 422);

    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const valores = campos.map((c) => (dados as any)[c]);

    const { rows } = await pool.query(
      `UPDATE ministerios SET ${sets} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!rows[0]) throw new AppError("Ministério não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

ministeriosRouter.delete("/:id", autenticar, exigirPapel("administrador"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM ministerios WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Ministério não encontrado.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
