import type { ResourceConfig } from "../components/ResourceCrud";

export const congregacoesConfig: ResourceConfig = {
  titulo: "Congregações",
  descricao: "Cadastre as congregações, endereço e responsável (horários múltiplos: edite via API por enquanto).",
  listPath: "/congregacoes",
  basePath: "/congregacoes",
  colunas: [
    { key: "nome", label: "Nome" },
    { key: "bairro", label: "Bairro" },
    { key: "cidade", label: "Cidade" },
    { key: "responsavel", label: "Responsável" },
  ],
  campos: [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "bairro", label: "Bairro", type: "text", required: true },
    { name: "cidade", label: "Cidade", type: "text", required: true },
    { name: "endereco", label: "Endereço", type: "text", required: true },
    { name: "telefone", label: "Telefone", type: "text" },
    { name: "responsavel", label: "Responsável", type: "text" },
    { name: "latitude", label: "Latitude", type: "number" },
    { name: "longitude", label: "Longitude", type: "number" },
  ],
};
