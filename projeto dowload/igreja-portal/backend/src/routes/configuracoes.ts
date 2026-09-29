import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { autenticar, exigirPapel } from "../middleware/auth.js";

export const configuracoesRouter = Router();

// Público: retorna todas as configurações como objeto chave/valor
configuracoesRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT chave, valor FROM configuracoes");
    const objeto = Object.fromEntries(rows.map((r) => [r.chave, r.valor]));
    res.json(objeto);
  } catch (err) {
    next(err);
  }
});

const atualizarSchema = z.record(z.string(), z.string());

// Admin: atualiza uma ou mais configurações de uma vez
configuracoesRouter.put("/", autenticar, exigirPapel("administrador"), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const dados = atualizarSchema.parse(req.body);
    await client.query("BEGIN");
    for (const [chave, valor] of Object.entries(dados)) {
      await client.query(
        `INSERT INTO configuracoes (chave, valor, atualizado_em) VALUES ($1, $2, now())
         ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor, atualizado_em = now()`,
        [chave, valor]
      );
    }
    await client.query("COMMIT");
    res.json({ mensagem: "Configurações atualizadas." });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});
