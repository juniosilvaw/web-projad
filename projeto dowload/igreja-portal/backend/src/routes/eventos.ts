import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";
import { gerarSlug } from "../utils/slug.js";

export const eventosRouter = Router();

const eventoSchema = z.object({
  nome: z.string().min(2).max(220),
  data_inicio: z.string(), // ISO datetime
  data_fim: z.string().optional(),
  local: z.string().max(200).optional(),
  descricao: z.string().optional(),
  imagem_url: z.string().url().optional(),
  publicado: z.boolean().optional(),
});

eventosRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM eventos WHERE publicado = true AND data_inicio >= now() - interval '1 day'
       ORDER BY data_inicio ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

eventosRouter.get("/:slug", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM eventos WHERE slug = $1 AND publicado = true",
      [req.params.slug]
    );
    if (!rows[0]) throw new AppError("Evento não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

eventosRouter.get("/admin/todos", autenticar, async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM eventos ORDER BY data_inicio DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

eventosRouter.post("/", autenticar, exigirPapel("administrador", "editor", "secretaria"), async (req, res, next) => {
  try {
    const dados = eventoSchema.parse(req.body);
    const slug = gerarSlug(dados.nome);

    const { rows } = await pool.query(
      `INSERT INTO eventos (slug, nome, data_inicio, data_fim, local, descricao, imagem_url, publicado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        slug,
        dados.nome,
        dados.data_inicio,
        dados.data_fim ?? null,
        dados.local ?? null,
        dados.descricao ?? null,
        dados.imagem_url ?? null,
        dados.publicado ?? false,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

eventosRouter.put("/:id", autenticar, exigirPapel("administrador", "editor", "secretaria"), async (req, res, next) => {
  try {
    const dados = eventoSchema.partial().parse(req.body);
    const campos = Object.keys(dados);
    if (campos.length === 0) throw new AppError("Nenhum campo para atualizar.", 422);

    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const valores = campos.map((c) => (dados as any)[c]);

    const { rows } = await pool.query(
      `UPDATE eventos SET ${sets} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!rows[0]) throw new AppError("Evento não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

eventosRouter.delete("/:id", autenticar, exigirPapel("administrador", "editor"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM eventos WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Evento não encontrado.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
