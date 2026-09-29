import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";
import { gerarSlug } from "../utils/slug.js";

export const noticiasRouter = Router();

const noticiaSchema = z.object({
  categoria: z.string().min(2).max(80),
  titulo: z.string().min(3).max(220),
  resumo: z.string().min(3).max(400),
  conteudo: z.string().min(3),
  imagem_url: z.string().url().optional(),
  publicado: z.boolean().optional(),
});

// Público: lista notícias publicadas (paginação simples)
noticiasRouter.get("/", async (req, res, next) => {
  try {
    const pagina = Math.max(1, Number(req.query.pagina) || 1);
    const porPagina = Math.min(50, Number(req.query.porPagina) || 12);
    const offset = (pagina - 1) * porPagina;

    const { rows } = await pool.query(
      `SELECT id, slug, categoria, titulo, resumo, imagem_url, publicado_em
       FROM noticias WHERE publicado = true
       ORDER BY publicado_em DESC LIMIT $1 OFFSET $2`,
      [porPagina, offset]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Público: notícia por slug
noticiasRouter.get("/:slug", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM noticias WHERE slug = $1 AND publicado = true",
      [req.params.slug]
    );
    if (!rows[0]) throw new AppError("Notícia não encontrada.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Admin: lista todas (inclusive rascunhos)
noticiasRouter.get("/admin/todas", autenticar, async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM noticias ORDER BY criado_em DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Admin: cria
noticiasRouter.post("/", autenticar, exigirPapel("administrador", "editor", "secretaria"), async (req, res, next) => {
  try {
    const dados = noticiaSchema.parse(req.body);
    const slug = gerarSlug(dados.titulo);

    const { rows } = await pool.query(
      `INSERT INTO noticias (slug, categoria, titulo, resumo, conteudo, imagem_url, publicado, publicado_em, autor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CASE WHEN $7 THEN now() ELSE NULL END, $8)
       RETURNING *`,
      [
        slug,
        dados.categoria,
        dados.titulo,
        dados.resumo,
        dados.conteudo,
        dados.imagem_url ?? null,
        dados.publicado ?? false,
        req.usuario!.id,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Admin: atualiza
noticiasRouter.put("/:id", autenticar, exigirPapel("administrador", "editor", "secretaria"), async (req, res, next) => {
  try {
    const dados = noticiaSchema.partial().parse(req.body);
    const campos = Object.keys(dados);
    if (campos.length === 0) throw new AppError("Nenhum campo para atualizar.", 422);

    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const valores = campos.map((c) => (dados as any)[c]);

    const { rows } = await pool.query(
      `UPDATE noticias SET ${sets}, atualizado_em = now() WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!rows[0]) throw new AppError("Notícia não encontrada.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Admin: remove
noticiasRouter.delete("/:id", autenticar, exigirPapel("administrador", "editor"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM noticias WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Notícia não encontrada.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
