import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { apiGet } from "../lib/api";
import type { Congregacao } from "../types";

export default function Congregacoes() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Congregacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controle = setTimeout(() => {
      const query = busca.trim() ? `?q=${encodeURIComponent(busca.trim())}` : "";
      setCarregando(true);
      apiGet<Congregacao[]>(`/congregacoes${query}`)
        .then(setResultados)
        .catch(() => setResultados([]))
        .finally(() => setCarregando(false));
    }, 250);
    return () => clearTimeout(controle);
  }, [busca]);

  return (
    <>
      <PageHeader
        eyebrow="Onde estamos"
        title="Congregações"
        description="Encontre a congregação mais próxima de você por bairro, cidade ou região."
      />

      <div className="container-page py-16">
        <label htmlFor="busca-congregacao" className="sr-only">
          Buscar congregação
        </label>
        <input
          id="busca-congregacao"
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por bairro, cidade ou região..."
          className="w-full max-w-md rounded-sm border border-line bg-white px-4 py-3 text-sm outline-none focus:border-primary"
        />

        {carregando && <p className="text-muted text-sm mt-6">Carregando...</p>}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {resultados.map((c) => (
            <div key={c.id} className="border border-line rounded-sm p-6 bg-white">
              <h2 className="font-serif text-xl mb-1">{c.nome}</h2>
              <p className="text-sm text-muted mb-4">
                {c.bairro} — {c.cidade}
              </p>
              <dl className="flex flex-col gap-1.5 text-sm text-muted">
                <div className="flex gap-2">
                  <dt className="font-medium text-ink shrink-0">Endereço:</dt>
                  <dd>{c.endereco}</dd>
                </div>
                {c.telefone && (
                  <div className="flex gap-2">
                    <dt className="font-medium text-ink shrink-0">Telefone:</dt>
                    <dd>{c.telefone}</dd>
                  </div>
                )}
                {c.responsavel && (
                  <div className="flex gap-2">
                    <dt className="font-medium text-ink shrink-0">Responsável:</dt>
                    <dd>{c.responsavel}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-3 flex flex-col gap-1 text-sm">
                {c.horarios.map((h) => (
                  <span key={h} className="text-ink">
                    {h}
                  </span>
                ))}
              </div>
              {c.latitude && c.longitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost mt-5 inline-flex"
                >
                  Como chegar
                </a>
              )}
            </div>
          ))}
          {!carregando && resultados.length === 0 && (
            <p className="text-muted">Nenhuma congregação encontrada para essa busca.</p>
          )}
        </div>
      </div>
    </>
  );
}
