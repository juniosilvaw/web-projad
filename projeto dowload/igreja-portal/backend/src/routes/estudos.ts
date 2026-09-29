import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";
import { gerarSlug } from "../utils/slug.js";

export const estudosRouter = Router();

const estudoSchema = z.object({
  categoria: z.string().min(2).max(80),
  titulo: z.string().min(2).max(220),
  conteudo: z.string().optional(),
  arquivo_url: z.string().url().optional(),
  publicado: z.boolean().optional(),
});

estudosRouter.get("/", async (req, res, next) => {
  try {
    const busca = (req.query.q as string | undefined)?.trim();
    const params: any[] = [];
    let sql = "SELECT * FROM estudos WHERE publicado = true";
    if (busca) {
      params.push(`%${busca}%`);
      sql += ` AND titulo ILIKE $${params.length}`;
    }
    sql += " ORDER BY criado_em DESC";
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

estudosRouter.get("/admin/todos", autenticar, async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM estudos ORDER BY criado_em DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

estudosRouter.post("/", autenticar, exigirPapel("administrador", "editor", "secretaria"), async (req, res, next) => {
  try {
    const dados = estudoSchema.parse(req.body);
    const slug = gerarSlug(dados.titulo);
    const { rows } = await pool.query(
      `INSERT INTO estudos (slug, categoria, titulo, conteudo, arquivo_url, publicado)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [slug, dados.categoria, dados.titulo, dados.conteudo ?? null, dados.arquivo_url ?? null, dados.publicado ?? false]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

estudosRouter.put("/:id", autenticar, exigirPapel("administrador", "editor", "secretaria"), async (req, res, next) => {
  try {
    const dados = estudoSchema.partial().parse(req.body);
    const campos = Object.keys(dados);
    if (campos.length === 0) throw new AppError("Nenhum campo para atualizar.", 422);
    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const valores = campos.map((c) => (dados as any)[c]);
    const { rows } = await pool.query(
      `UPDATE estudos SET ${sets} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!rows[0]) throw new AppError("Conteúdo não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

estudosRouter.delete("/:id", autenticar, exigirPapel("administrador", "editor"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM estudos WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Conteúdo não encontrado.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
