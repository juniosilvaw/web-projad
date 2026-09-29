import type { ResourceConfig } from "../components/ResourceCrud";

export const bannersConfig: ResourceConfig = {
  titulo: "Banners",
  descricao: "Configure os banners do carrossel da página inicial.",
  listPath: "/banners",
  basePath: "/banners",
  colunas: [
    { key: "titulo", label: "Título" },
    { key: "ordem", label: "Ordem" },
  ],
  campos: [
    { name: "titulo", label: "Título", type: "text" },
    { name: "subtitulo", label: "Subtítulo", type: "text" },
    { name: "imagem_url", label: "URL da imagem", type: "text", required: true },
    { name: "link_url", label: "URL de destino (opcional)", type: "text" },
    { name: "ordem", label: "Ordem de exibição", type: "number" },
  ],
};
