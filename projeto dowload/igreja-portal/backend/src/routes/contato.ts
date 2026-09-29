import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

export const contatoRouter = Router();

const mensagemSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  mensagem: z.string().min(3, "Escreva sua mensagem."),
});

contatoRouter.post("/", async (req, res, next) => {
  try {
    const dados = mensagemSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO mensagens_contato (nome, email, mensagem) VALUES ($1, $2, $3) RETURNING id, criado_em`,
      [dados.nome, dados.email, dados.mensagem]
    );
    res.status(201).json({ mensagem: "Mensagem enviada com sucesso.", id: rows[0].id });
  } catch (err) {
    next(err);
  }
});

contatoRouter.get("/", autenticar, async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM mensagens_contato ORDER BY criado_em DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

contatoRouter.patch("/:id/lida", autenticar, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "UPDATE mensagens_contato SET lida = true WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (!rows[0]) throw new AppError("Mensagem não encontrada.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});
