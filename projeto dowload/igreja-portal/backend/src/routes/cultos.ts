import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

export const cultosRouter = Router();

const cultoSchema = z.object({
  dia_semana: z.number().int().min(0).max(6),
  nome: z.string().min(2).max(120),
  horario: z.string(), // "HH:MM"
  descricao: z.string().max(500).optional(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

// Público: lista de cultos ativos
cultosRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM cultos WHERE ativo = true ORDER BY ordem, dia_semana"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Admin: cria
cultosRouter.post("/", autenticar, exigirPapel("administrador", "secretaria"), async (req, res, next) => {
  try {
    const dados = cultoSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO cultos (dia_semana, nome, horario, descricao, ordem)
       VALUES ($1, $2, $3, $4, COALESCE($5, 0)) RETURNING *`,
      [dados.dia_semana, dados.nome, dados.horario, dados.descricao ?? null, dados.ordem]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Admin: atualiza
cultosRouter.put("/:id", autenticar, exigirPapel("administrador", "secretaria"), async (req, res, next) => {
  try {
    const dados = cultoSchema.partial().parse(req.body);
    const campos = Object.keys(dados);
    if (campos.length === 0) throw new AppError("Nenhum campo para atualizar.", 422);

    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const valores = campos.map((c) => (dados as any)[c]);

    const { rows } = await pool.query(
      `UPDATE cultos SET ${sets} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!rows[0]) throw new AppError("Culto não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Admin: remove
cultosRouter.delete("/:id", autenticar, exigirPapel("administrador"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM cultos WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Culto não encontrado.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
