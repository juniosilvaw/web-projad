import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

export const liderancaRouter = Router();

const categorias = [
  "presidencia",
  "pastores",
  "evangelistas",
  "presbiteros",
  "diaconos",
  "lideres_departamento",
] as const;

const liderSchema = z.object({
  nome: z.string().min(2).max(150),
  funcao: z.string().min(2).max(150),
  categoria: z.enum(categorias),
  bio: z.string().max(2000).optional(),
  foto_url: z.string().url().optional(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

liderancaRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM lideres WHERE ativo = true ORDER BY categoria, ordem"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

liderancaRouter.post("/", autenticar, exigirPapel("administrador", "secretaria"), async (req, res, next) => {
  try {
    const dados = liderSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO lideres (nome, funcao, categoria, bio, foto_url, ordem)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 0)) RETURNING *`,
      [dados.nome, dados.funcao, dados.categoria, dados.bio ?? null, dados.foto_url ?? null, dados.ordem]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

liderancaRouter.put("/:id", autenticar, exigirPapel("administrador", "secretaria"), async (req, res, next) => {
  try {
    const dados = liderSchema.partial().parse(req.body);
    const campos = Object.keys(dados);
    if (campos.length === 0) throw new AppError("Nenhum campo para atualizar.", 422);

    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const valores = campos.map((c) => (dados as any)[c]);

    const { rows } = await pool.query(
      `UPDATE lideres SET ${sets} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!rows[0]) throw new AppError("Líder não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

liderancaRouter.delete("/:id", autenticar, exigirPapel("administrador"), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM lideres WHERE id = $1", [req.params.id]);
    if (!rowCount) throw new AppError("Líder não encontrado.", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
