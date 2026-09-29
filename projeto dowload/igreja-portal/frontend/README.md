# Frontend — Portal Institucional (site público)

Site institucional em React + TypeScript + Tailwind CSS. Consome a API do
backend para cultos, notícias, eventos, liderança, ministérios,
congregações, estudos, mídia e configurações do site (contato, redes
sociais, PIX) — nada mais fica fixo no código.

## Como rodar

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se a API não estiver em localhost:3333
npm run dev             # ambiente de desenvolvimento
npm run build            # build de produção (pasta dist/)
```

Precisa do backend rodando (veja ../backend/README.md) para carregar dados
reais — sem ele, o site usa valores padrão em src/config/site.ts (mesmo
texto de placeholder) até a API responder.

## Estrutura

```
src/
  components/
    layout/    Header, Footer, Layout
    home/      Seções da página inicial (buscam dados da API)
    ui/        Componentes reutilizáveis (SectionHeading, PageHeader, ImagePanel)
  context/     SiteDataContext — carrega configurações e cultos uma vez, no topo
  lib/         Cliente de API (fetch) e helpers de formatação
  config/      Valores padrão (fallback) e estrutura do menu
  pages/       Uma página por rota, cada uma buscando seus próprios dados
  types/       Tipos TypeScript espelhando as respostas da API
```

## Páginas

`/`, `/a-igreja`, `/lideranca`, `/ministerios`, `/congregacoes`,
`/eventos`, `/eventos/:slug`, `/noticias`, `/noticias/:slug`, `/midia`,
`/estudos`, `/contato`, `/contribua`, `/pedido-de-oracao`,
`/privacidade`, `/termos`.

## Próximas etapas sugeridas

- Imagens reais: os painéis ilustrados (`ImagePanel`) são placeholders
  originais em SVG — trocar por fotos reais quando o painel administrativo
  tiver upload de imagem
- Conteúdo institucional (história, missão, visão) em `/a-igreja` ainda é
  texto estático — não há tabela no backend para isso ainda
