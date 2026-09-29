export const diasSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function nomeDiaSemana(dia: number): string {
  return diasSemana[dia] ?? "—";
}

export function formatarHorario(horario: string): string {
  const [h, m] = horario.split(":");
  return `${h}h${m}`;
}

export function formatarData(iso: string, opcoes: Intl.DateTimeFormatOptions = {}): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...opcoes,
  });
}

const tons = ["primary", "accent", "primary-light"] as const;

export function tomPorId(id: string): (typeof tons)[number] {
  let soma = 0;
  for (let i = 0; i < id.length; i++) soma += id.charCodeAt(i);
  return tons[soma % tons.length];
}
