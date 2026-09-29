import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../config/db.js";
import { AppError } from "../utils/AppError.js";
import { autenticar } from "../middleware/auth.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, senha } = loginSchema.parse(req.body);

    const { rows } = await pool.query(
      "SELECT id, nome, email, senha_hash, papel, ativo FROM usuarios WHERE email = $1",
      [email]
    );
    const usuario = rows[0];

    if (!usuario || !usuario.ativo) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "8h") as jwt.SignOptions["expiresIn"] }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", autenticar, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, nome, email, papel FROM usuarios WHERE id = $1",
      [req.usuario!.id]
    );
    if (!rows[0]) throw new AppError("Usuário não encontrado.", 404);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});
