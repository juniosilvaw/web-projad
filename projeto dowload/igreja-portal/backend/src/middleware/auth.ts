import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export interface UsuarioAutenticado {
  id: string;
  email: string;
  papel: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export function autenticar(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("Token de autenticação ausente.", 401));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as UsuarioAutenticado;
    req.usuario = payload;
    next();
  } catch {
    next(new AppError("Token inválido ou expirado.", 401));
  }
}

export function exigirPapel(...papeis: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario || !papeis.includes(req.usuario.papel)) {
      return next(new AppError("Você não tem permissão para esta ação.", 403));
    }
    next();
  };
}
