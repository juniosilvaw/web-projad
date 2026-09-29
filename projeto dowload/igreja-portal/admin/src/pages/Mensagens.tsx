import { useEffect, useState } from "react";
import { apiGet, apiPatch, ApiError } from "../lib/api";

interface Mensagem {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  lida: boolean;
  criado_em: string;
}

export default function Mensagens() {
  const [itens, setItens] = useState<Mensagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    try {
      const dados = await apiGet<Mensagem[]>("/contato");
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

  async function marcarLida(id: string) {
    await apiPatch(`/contato/${id}/lida`);
    carregar();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Mensagens de contato</h1>
      {erro && <p className="text-sm text-red-700 mb-4">{erro}</p>}
      {carregando && <p className="text-muted text-sm">Carregando...</p>}

      <div className="flex flex-col gap-4">
        {itens.map((item) => (
          <div key={item.id} className="border border-line rounded-sm bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{item.nome}</p>
                <p className="text-xs text-muted">
                  {item.email} · {new Date(item.criado_em).toLocaleString("pt-BR")}
                </p>
              </div>
              {item.lida ? (
                <span className="text-xs text-primary font-medium shrink-0">Lida</span>
              ) : (
                <button onClick={() => marcarLida(item.id)} className="btn-outline shrink-0 text-xs px-3 py-1.5">
                  Marcar como lida
                </button>
              )}
            </div>
            <p className="text-sm text-ink mt-3">{item.mensagem}</p>
          </div>
        ))}
        {!carregando && itens.length === 0 && (
          <p className="text-muted text-sm">Nenhuma mensagem recebida ainda.</p>
        )}
      </div>
    </div>
  );
}
