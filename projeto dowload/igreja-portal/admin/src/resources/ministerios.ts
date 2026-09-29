import type { ResourceConfig } from "../components/ResourceCrud";

export const ministeriosConfig: ResourceConfig = {
  titulo: "Ministérios",
  descricao: "Cadastre os ministérios da igreja, líderes e horários.",
  listPath: "/ministerios",
  basePath: "/ministerios",
  colunas: [
    { key: "nome", label: "Nome" },
    { key: "lideranca", label: "Liderança" },
    { key: "horarios", label: "Horários" },
  ],
  campos: [
    { name: "nome", label: "Nome do ministério", type: "text", required: true },
    { name: "descricao", label: "Descrição", type: "textarea" },
    { name: "lideranca", label: "Liderança", type: "text" },
    { name: "horarios", label: "Horários", type: "text" },
    { name: "contato", label: "Contato", type: "text" },
    { name: "foto_url", label: "URL da imagem", type: "text" },
  ],
};
