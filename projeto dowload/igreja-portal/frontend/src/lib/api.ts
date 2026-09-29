const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(dados.erro || "Erro ao carregar dados.", res.status);
  return dados as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(dados.erro || "Erro ao enviar.", res.status);
  return dados as T;
}
