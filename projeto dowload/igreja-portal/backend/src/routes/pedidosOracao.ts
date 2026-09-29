import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

export const pedidosOracaoRouter = Router();

const pedidoSchema = z
  .object({
    nome: z.string().max(150).optional(),
    email: z.string().email().optional().or(z.literal("")),
    telefone: z.string().max(40).optional(),
    pedido: z.string().min(3, "Escreva seu pedido de oração."),
    anonimo: z.boolean().optional(),
  })
  .refine((d) => d.anonimo || (d.nome && d.email), {
    message: "Informe nome e e-mail, ou marque a opção de anonimato.",
    path: ["nome"],
  });

// Público: envia pedido
pedidosOracaoRouter.post("/", async (req, res, next) => {
  try {
    const dados = pedidoSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO pedidos_oracao (nome, email, telefone, pedido, anonimo)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, criado_em`,
      [
        dados.anonimo ? null : dados.nome,
        dados.anonimo ? null : dados.email || null,
        dados.telefone || null,
        dados.pedido,
        dados.anonimo ?? false,
      ]
    );
    res.status(201).json({ mensagem: "Pedido enviado com sucesso.", id: rows[0].id });
  } catch (err) {
    next(err);
  }
});

// Admin: lista pedidos
pedidosOracaoRouter.get("/", autenticar, async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM pedidos_oracao ORDER BY criado_em DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Admin: marca como atendido
pedidosOracaoRouter.patch("/:id/atender", autenticar, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "UPDATE pedidos_oracao SET atendido = true WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (!rows[0]) throw new AppError("Pedido não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});
