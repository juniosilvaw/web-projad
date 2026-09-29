import type { ResourceConfig } from "../components/ResourceCrud";

const dias = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
];

export const cultosConfig: ResourceConfig = {
  titulo: "Cultos",
  descricao: "Configure a agenda semanal de cultos exibida no site.",
  listPath: "/cultos",
  basePath: "/cultos",
  colunas: [
    { key: "nome", label: "Nome" },
    { key: "dia_semana", label: "Dia", render: (i) => dias.find((d) => Number(d.value) === i.dia_semana)?.label ?? "—" },
    { key: "horario", label: "Horário" },
  ],
  campos: [
    { name: "nome", label: "Nome do culto", type: "text", required: true },
    { name: "dia_semana", label: "Dia da semana", type: "select", options: dias, required: true, numeric: true },
    { name: "horario", label: "Horário", type: "horario", required: true },
    { name: "descricao", label: "Descrição", type: "textarea" },
    { name: "ordem", label: "Ordem de exibição", type: "number" },
  ],
};
