import { useEffect, useState } from "react";
import { apiGet, apiPatch, ApiError } from "../lib/api";

interface PedidoOracao {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  pedido: string;
  anonimo: boolean;
  atendido: boolean;
  criado_em: string;
}

export default function PedidosOracao() {
  const [itens, setItens] = useState<PedidoOracao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    try {
      const dados = await apiGet<PedidoOracao[]>("/pedidos-oracao");
      setItens(dados);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Não foi possível carregar.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function marcarAtendido(id: string) {
    await apiPatch(`/pedidos-oracao/${id}/atender`);
    carregar();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Pedidos de oração</h1>
      {erro && <p className="text-sm text-red-700 mb-4">{erro}</p>}
      {carregando && <p className="text-muted text-sm">Carregando...</p>}

      <div className="flex flex-col gap-4">
        {itens.map((item) => (
          <div key={item.id} className="border border-line rounded-sm bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  {item.anonimo ? "Pedido anônimo" : item.nome || "Sem nome"}
                </p>
                <p className="text-xs text-muted">
                  {new Date(item.criado_em).toLocaleString("pt-BR")}
                  {!item.anonimo && item.email ? ` · ${item.email}` : ""}
                  {!item.anonimo && item.telefone ? ` · ${item.telefone}` : ""}
                </p>
              </div>
              {item.atendido ? (
                <span className="text-xs text-primary font-medium shrink-0">Atendido</span>
              ) : (
                <button onClick={() => marcarAtendido(item.id)} className="btn-outline shrink-0 text-xs px-3 py-1.5">
                  Marcar como atendido
                </button>
              )}
            </div>
            <p className="text-sm text-ink mt-3">{item.pedido}</p>
          </div>
        ))}
        {!carregando && itens.length === 0 && (
          <p className="text-muted text-sm">Nenhum pedido de oração recebido ainda.</p>
        )}
      </div>
    </div>
  );
}
