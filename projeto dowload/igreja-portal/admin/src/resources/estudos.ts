import type { ResourceConfig } from "../components/ResourceCrud";

export const estudosConfig: ResourceConfig = {
  titulo: "Estudos",
  descricao: "Publique estudos bíblicos, devocionais, artigos, sermões e pregações.",
  listPath: "/estudos/admin/todos",
  basePath: "/estudos",
  colunas: [
    { key: "titulo", label: "Título" },
    { key: "categoria", label: "Categoria" },
    { key: "publicado", label: "Status", render: (i) => (i.publicado ? "Publicado" : "Rascunho") },
  ],
  campos: [
    { name: "titulo", label: "Título", type: "text", required: true },
    { name: "categoria", label: "Categoria", type: "text", required: true },
    { name: "conteudo", label: "Conteúdo", type: "textarea" },
    { name: "arquivo_url", label: "URL do arquivo/áudio/vídeo", type: "text" },
    { name: "publicado", label: "Publicado", type: "boolean" },
  ],
};
