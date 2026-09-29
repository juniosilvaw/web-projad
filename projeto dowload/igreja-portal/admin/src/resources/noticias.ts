import type { ResourceConfig } from "../components/ResourceCrud";

export const noticiasConfig: ResourceConfig = {
  titulo: "Notícias",
  descricao: "Cadastre, edite e publique notícias exibidas no site.",
  listPath: "/noticias/admin/todas",
  basePath: "/noticias",
  colunas: [
    { key: "titulo", label: "Título" },
    { key: "categoria", label: "Categoria" },
    { key: "publicado", label: "Status", render: (i) => (i.publicado ? "Publicada" : "Rascunho") },
  ],
  campos: [
    { name: "titulo", label: "Título", type: "text", required: true },
    { name: "categoria", label: "Categoria", type: "text", required: true },
    { name: "resumo", label: "Resumo", type: "textarea", required: true },
    { name: "conteudo", label: "Conteúdo", type: "textarea", required: true },
    { name: "imagem_url", label: "URL da imagem", type: "text" },
    { name: "publicado", label: "Publicada", type: "boolean" },
  ],
};
