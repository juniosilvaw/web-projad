# Portal Institucional — Assembleia de Deus

Projeto completo: site público, painel administrativo e API/banco de dados.
Este pacote reúne os três projetos e a configuração de deploy (Docker).

## Estrutura

```
igreja-portal/
  frontend/    Site público (React + TypeScript + Tailwind) — consome a API
  backend/     API (Node.js + Express + PostgreSQL)
  admin/       Painel administrativo (React + TypeScript + Tailwind)
  docker-compose.yml
```

## Como rodar tudo com Docker (recomendado)

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e Docker Compose
instalados (o Docker Desktop já inclui os dois).

1. Copie o arquivo de variáveis de ambiente:
   ```
   cp .env.example .env
   ```
   (os valores padrão já funcionam para testar localmente — troque `JWT_SECRET`
   antes de usar em produção)

2. Suba tudo com um único comando, a partir da pasta `igreja-portal/`:
   ```
   docker compose up --build
   ```

3. Aguarde a mensagem de que o banco está pronto e os serviços subirem. Acesse:
   - Site: http://localhost:8080
   - Painel administrativo: http://localhost:8081
   - API: http://localhost:3333/api

4. Login inicial do painel administrativo:
   - E-mail: `admin@igreja.local`
   - Senha: `TrocarSenha123!`
   (troque a senha assim que possível — ver seção "Segurança" abaixo)

O banco de dados é criado, o schema aplicado e os dados de exemplo
(cultos, notícias, eventos, congregações etc.) inseridos automaticamente na
primeira vez que o container do Postgres sobe (via `backend/migrations/`,
montado em `/docker-entrypoint-initdb.d`). Os dados ficam salvos no volume
Docker `igreja_db_data` entre reinicializações.

Para parar tudo: `docker compose down` (os dados do banco continuam salvos).
Para apagar também os dados do banco: `docker compose down -v`.

## Como rodar sem Docker (desenvolvimento)

Veja o README de cada pasta (`backend/README.md`, `frontend/README.md`,
`admin/README.md`) para instruções de execução individual com `npm run dev`.
Você vai precisar de um PostgreSQL local rodando.

## O que já funciona (testado)

- Site público consome dados reais do banco via API: cultos, notícias,
  eventos, liderança, ministérios, congregações (com busca), estudos, mídia,
  configurações de contato/redes sociais/PIX — tudo editável pelo painel
- Formulários de contato e pedido de oração gravam no banco de dados
- Painel administrativo: login, CRUD completo de todo o conteúdo, gestão de
  pedidos de oração e mensagens de contato, configurações do site
- Testado de ponta a ponta com PostgreSQL real (ver seção "Como foi testado")

## Segurança — antes de usar em produção

- Troque `JWT_SECRET` no `.env` por um valor aleatório forte
- Troque a senha do usuário administrador padrão (crie um novo usuário e
  desative/remova o `admin@igreja.local`, ou rode
  `docker compose exec backend npm run seed:admin` com as variáveis
  `ADMIN_EMAIL`/`ADMIN_SENHA` definidas)
- Sirva atrás de HTTPS (ex.: um proxy reverso como Caddy, Nginx ou Traefik
  na frente dos serviços, ou um provedor de hospedagem com TLS gerenciado)
- Restrinja `CORS_ORIGIN` aos domínios reais de produção
- Configure backups do volume `igreja_db_data`

## Como foi testado

Este pacote foi validado em um ambiente sem acesso ao Docker Hub (rede
restrita), então a integração completa foi testada rodando os três serviços
nativamente (PostgreSQL local + `node dist/server.js` + os builds de
produção do frontend e do admin servidos localmente), confirmando que:
- O site carrega cultos, notícias, eventos, liderança, ministérios,
  congregações (com busca) e configurações diretamente da API/banco
- Os formulários de contato e pedido de oração gravam no banco
- O painel administrativo autentica e faz CRUD real de cada recurso, e as
  mudanças aparecem no site público
- Os `Dockerfile` de cada serviço e o `docker-compose.yml` seguem a prática
  padrão (multi-stage build, Nginx servindo os builds estáticos, variáveis
  de ambiente) e devem funcionar diretamente em uma máquina com acesso
  normal à internet — não foi possível rodar `docker compose up` neste
  ambiente específico por causa dessa restrição de rede, então vale testar
  esse passo específico ao rodar localmente.
