# Painel Administrativo — Portal Institucional (Etapa 2)

Painel administrativo em React + TypeScript + Tailwind CSS para gerenciar
o conteudo do site institucional (consome a API do backend).

## Como rodar

1. Copie .env.example para .env e ajuste VITE_API_URL se necessario
   (padrao: http://localhost:3333/api).
2. npm install
3. npm run dev

Login inicial (definido no seed do backend): admin@igreja.local / TrocarSenha123!

## O que ja funciona

- Login com JWT (token guardado no localStorage, redireciona se expirar/ausente)
- Dashboard com contadores (pedidos de oracao pendentes, mensagens nao lidas,
  noticias publicadas, proximos eventos)
- CRUD completo (listar, criar, editar, excluir) para: Noticias, Eventos,
  Cultos, Lideranca, Ministerios, Congregacoes, Estudos, Midia, Banners
- Pedidos de oracao: lista + marcar como atendido
- Mensagens de contato: lista + marcar como lida
- Configuracoes: formulario para contato, redes sociais e chave PIX

## Arquitetura

O CRUD de cada recurso e gerado por um unico componente generico
(src/components/ResourceCrud.tsx), configurado por arquivo em
src/resources/*.ts (colunas da tabela + campos do formulario). Isso deixou
o painel consistente e faz com que adicionar um novo tipo de conteudo seja
so criar um novo arquivo de configuracao, sem duplicar tela.

## Limitacoes conhecidas / proximos passos

- Upload de imagem ainda nao existe -- os campos de imagem sao URLs
- Horarios multiplos de uma congregacao (tabela congregacao_horarios) ainda
  sao editados so na criacao via API; falta tela dedicada no painel
- Falta pagina propria para gerenciar usuarios administrativos (hoje e via
  npm run seed:admin no backend)
