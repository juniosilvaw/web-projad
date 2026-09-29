import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

export const congregacoesRouter = Router();

const congregacaoSchema = z.object({
  nome: z.string().min(2).max(150),
  bairro: z.string().min(1).max(120),
  cidade: z.string().min(1).max(120),
  endereco: z.string().min(3).max(255),
  telefone: z.string().max(40).optional(),
  responsavel: z.string().max(150).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  horarios: z.array(z.string().max(120)).optional(),
  ativo: z.boolean().optional(),
});

// Público: busca por bairro/cidade/região via ?q=
congregacoesRouter.get("/", async (req, res, next) => {
  try {
    const termo = (req.query.q as string | undefined)?.trim();

    const base = `
      SELECT c.*, COALESCE(
        json_agg(h.descricao) FILTER (WHERE h.id IS NOT NULL), '[]'
      ) AS horarios
      FROM congregacoes c
      LEFT JOIN congregacao_horarios h ON h.congregacao_id = c.id
      WHERE c.ativo = true`;

    const { rows } = termo
      ? await pool.query(
          `${base} AND (c.nome ILIKE $1 OR c.bairro ILIKE $1 OR c.cidade ILIKE $1)
           GROUP BY c.id ORDER BY c.nome`,
          [`%${termo}%`]
        )
      : await pool.query(`${base} GROUP BY c.id ORDER BY c.nome`);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

congregacoesRouter.post("/", autenticar, exigirPapel("administrador", "secretaria"), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const dados = congregacaoSchema.parse(req.body);
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO congregacoes (nome, bairro, cidade, endereco, telefone, responsavel, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [dados.nome, dados.bairro, dados.cidade, dados.endereco, dados.telefone ?? null, dados.responsavel ?? null, dados.latitude ?? null, dados.longitude ?? null]
    );
    const congregacao = rows[0];

    for (const descricao of dados.horarios ?? []) {
      await client.query(
        "INSERT INTO congregacao_horarios (congregacao_id, descricao) VALUES ($1, $2)",
        [congregacao.id, descricao]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(congregacao);
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

congregacoesRouter.put("/:id", autenticar, exigirPapel("administrador", "secretaria"), async (req, res, next) => {
  try {
    const dados = congregacaoSchema.partial().omit({ horarios: true }).parse(req.body);
    const campos = Object.keys(dados);
    if (campos.length === 0) throw new AppError("Nenhum campo para atualizar.", 422);

    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const valores = campos.map((c) => (dados as any)[c]);

    const { rows } = await pool.query(
      `UPDATE congregacoes SET ${sets} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!rows[0]) throw new AppError("Congregação não encontrada.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

congregacoesRouter.delete("/:id", autenticar, exigirPapel("administrador"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM congregacoes WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Congregação não encontrada.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
