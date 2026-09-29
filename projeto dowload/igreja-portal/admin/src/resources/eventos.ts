import type { ResourceConfig } from "../components/ResourceCrud";

export const eventosConfig: ResourceConfig = {
  titulo: "Eventos",
  descricao: "Cadastre e publique os próximos eventos da igreja.",
  listPath: "/eventos/admin/todos",
  basePath: "/eventos",
  colunas: [
    { key: "nome", label: "Nome" },
    { key: "data_inicio", label: "Data", render: (i) => new Date(i.data_inicio).toLocaleString("pt-BR") },
    { key: "local", label: "Local" },
    { key: "publicado", label: "Status", render: (i) => (i.publicado ? "Publicado" : "Rascunho") },
  ],
  campos: [
    { name: "nome", label: "Nome do evento", type: "text", required: true },
    { name: "data_inicio", label: "Data e hora de início", type: "datetime-local", required: true },
    { name: "data_fim", label: "Data e hora de término", type: "datetime-local" },
    { name: "local", label: "Local", type: "text" },
    { name: "descricao", label: "Descrição", type: "textarea" },
    { name: "imagem_url", label: "URL da imagem", type: "text" },
    { name: "publicado", label: "Publicado", type: "boolean" },
  ],
};
