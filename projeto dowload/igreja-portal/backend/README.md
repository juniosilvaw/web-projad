# Backend — Portal Institucional (Etapa 2)

API REST em Node.js + Express + TypeScript + PostgreSQL para o portal
institucional da igreja.

## Como rodar

1. Tenha um PostgreSQL disponível e crie o banco:
   createdb igreja_db

2. Copie .env.example para .env e ajuste DATABASE_URL, JWT_SECRET, CORS_ORIGIN.

3. Aplique o schema e o seed de dados ficticios:
   psql -d igreja_db -f migrations/001_schema.sql
   psql -d igreja_db -f migrations/002_seed.sql

4. Instale as dependencias e crie o usuario administrador:
   npm install
   npm run seed:admin
   (por padrao cria admin@igreja.local / TrocarSenha123! -- troque via
   variaveis de ambiente ADMIN_EMAIL e ADMIN_SENHA antes de rodar)

5. Suba o servidor:
   npm run dev      # desenvolvimento (watch)
   npm run build && npm start   # producao

A API sobe em http://localhost:3333 (ajustavel via PORT no .env).

## Estrutura

src/
  config/db.ts         Pool de conexao com o PostgreSQL
  middleware/           Autenticacao JWT, controle de papeis, tratamento de erros
  routes/                Uma rota por recurso (publica + admin)
  server.ts              Bootstrap do Express

migrations/
  001_schema.sql        Schema completo (14 tabelas)
  002_seed.sql           Dados ficticios para desenvolvimento
  003_admin_seed.sql     Cria admin@igreja.local / TrocarSenha123! (usado pelo Docker; rode manualmente se nao usar Docker)

## Autenticacao

Login: POST /api/auth/login { email, senha } -> { token, usuario }
Rotas protegidas exigem header: Authorization: Bearer <token>

Papeis: administrador, pastor, secretaria, editor -- cada rota de escrita
exige um subconjunto de papeis (ver middleware exigirPapel nas rotas).

## Endpoints principais

Publicos (GET):
  /api/cultos, /api/noticias, /api/noticias/:slug, /api/eventos,
  /api/eventos/:slug, /api/lideranca, /api/ministerios, /api/ministerios/:slug,
  /api/congregacoes?q=busca, /api/estudos?q=busca, /api/midias, /api/banners,
  /api/configuracoes

Publicos (POST, com rate limit):
  /api/pedidos-oracao, /api/contato

Administrativos (autenticados):
  CRUD completo (POST/PUT/DELETE) em todos os recursos acima, mais
  GET /api/noticias/admin/todas, GET /api/eventos/admin/todos,
  GET /api/estudos/admin/todos, GET /api/pedidos-oracao, GET /api/contato,
  PATCH /api/pedidos-oracao/:id/atender, PATCH /api/contato/:id/lida,
  PUT /api/configuracoes

## Testado

Validado ponta a ponta com PostgreSQL real: login, autorizacao por papel,
CRUD de cada recurso, validacao de formularios (Zod), busca de congregacoes,
atualizacao de configuracoes -- todos os endpoints responderam como esperado.

## Proximos passos sugeridos

- Upload de imagens (hoje os campos de imagem sao apenas URLs)
- Testes automatizados (Jest/Vitest + Supertest)
- Deploy (Docker, variaveis de ambiente de producao, HTTPS)
