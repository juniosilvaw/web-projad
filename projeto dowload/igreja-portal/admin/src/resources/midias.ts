import type { ResourceConfig } from "../components/ResourceCrud";

export const midiasConfig: ResourceConfig = {
  titulo: "Mídia",
  descricao: "Adicione vídeos, pregações, transmissões e podcasts (link do YouTube, etc).",
  listPath: "/midias",
  basePath: "/midias",
  colunas: [
    { key: "titulo", label: "Título" },
    { key: "categoria", label: "Categoria" },
    { key: "url", label: "URL" },
  ],
  campos: [
    { name: "titulo", label: "Título", type: "text", required: true },
    { name: "categoria", label: "Categoria", type: "text", required: true },
    { name: "url", label: "URL (YouTube, áudio, etc)", type: "text", required: true },
  ],
};
