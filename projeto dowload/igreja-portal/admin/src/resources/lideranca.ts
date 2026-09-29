import type { ResourceConfig } from "../components/ResourceCrud";

const categorias = [
  { value: "presidencia", label: "Presidência" },
  { value: "pastores", label: "Pastores" },
  { value: "evangelistas", label: "Evangelistas" },
  { value: "presbiteros", label: "Presbíteros" },
  { value: "diaconos", label: "Diáconos" },
  { value: "lideres_departamento", label: "Líderes de Departamento" },
];

export const liderancaConfig: ResourceConfig = {
  titulo: "Liderança",
  descricao: "Cadastre pastores, evangelistas, presbíteros, diáconos e líderes.",
  listPath: "/lideranca",
  basePath: "/lideranca",
  colunas: [
    { key: "nome", label: "Nome" },
    { key: "funcao", label: "Função" },
    { key: "categoria", label: "Categoria", render: (i) => categorias.find((c) => c.value === i.categoria)?.label ?? i.categoria },
  ],
  campos: [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "funcao", label: "Função", type: "text", required: true },
    { name: "categoria", label: "Categoria", type: "select", options: categorias, required: true },
    { name: "bio", label: "Biografia", type: "textarea" },
    { name: "foto_url", label: "URL da foto", type: "text" },
    { name: "ordem", label: "Ordem de exibição", type: "number" },
  ],
};
