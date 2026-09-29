import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { authRouter } from "./routes/auth.js";
import { cultosRouter } from "./routes/cultos.js";
import { noticiasRouter } from "./routes/noticias.js";
import { eventosRouter } from "./routes/eventos.js";
import { liderancaRouter } from "./routes/lideranca.js";
import { ministeriosRouter } from "./routes/ministerios.js";
import { congregacoesRouter } from "./routes/congregacoes.js";
import { pedidosOracaoRouter } from "./routes/pedidosOracao.js";
import { contatoRouter } from "./routes/contato.js";
import { configuracoesRouter } from "./routes/configuracoes.js";
import { bannersRouter } from "./routes/banners.js";
import { estudosRouter } from "./routes/estudos.js";
import { midiasRouter } from "./routes/midias.js";
import { tratarErros, rotaNaoEncontrada } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(express.json());

// Limite de requisições para rotas públicas de formulário (evita spam/abuso)
const limitadorFormularios = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/cultos", cultosRouter);
app.use("/api/noticias", noticiasRouter);
app.use("/api/eventos", eventosRouter);
app.use("/api/lideranca", liderancaRouter);
app.use("/api/ministerios", ministeriosRouter);
app.use("/api/congregacoes", congregacoesRouter);
app.use("/api/pedidos-oracao", limitadorFormularios, pedidosOracaoRouter);
app.use("/api/contato", limitadorFormularios, contatoRouter);
app.use("/api/configuracoes", configuracoesRouter);
app.use("/api/banners", bannersRouter);
app.use("/api/estudos", estudosRouter);
app.use("/api/midias", midiasRouter);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

const PORT = Number(process.env.PORT) || 3333;
app.listen(PORT, () => {
  console.log(`API do portal institucional rodando na porta ${PORT}`);
});
