import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export function tratarErros(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      erro: "Dados inválidos.",
      detalhes: err.issues.map((i) => ({ campo: i.path.join("."), mensagem: i.message })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message });
  }

  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}

export function rotaNaoEncontrada(_req: Request, res: Response) {
  res.status(404).json({ erro: "Rota não encontrada." });
}
