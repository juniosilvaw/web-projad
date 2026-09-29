import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { apiGet } from "../lib/api";
import type { Estudo } from "../types";

const categorias = [
  "Todos",
  "Estudos Bíblicos",
  "Escola Bíblica",
  "Devocionais",
  "Artigos",
  "Sermões",
  "Pregações",
];

export default function Estudos() {
  const [conteudos, setConteudos] = useState<Estudo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  useEffect(() => {
    apiGet<Estudo[]>("/estudos")
      .then(setConteudos)
      .catch(() => setConteudos([]))
      .finally(() => setCarregando(false));
  }, []);

  const resultados = useMemo(() => {
    return conteudos.filter((c) => {
      const bateCategoria = categoria === "Todos" || c.categoria === categoria;
      const bateBusca = c.titulo.toLowerCase().includes(busca.trim().toLowerCase());
      return bateCategoria && bateBusca;
    });
  }, [conteudos, busca, categoria]);

  return (
    <>
      <PageHeader
        eyebrow="Ensino"
        title="Estudos bíblicos"
        description="Estudos, devocionais, artigos e pregações para o seu crescimento espiritual."
      />

      <div className="container-page py-16">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full sm:max-w-xs rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`rounded-sm border px-3 py-1.5 text-xs transition-colors ${
                  categoria === c
                    ? "border-primary bg-primary text-white"
                    : "border-line text-ink/70 hover:border-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {carregando && <p className="text-muted text-sm mt-10">Carregando...</p>}

        <ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
          {resultados.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-4">
              <span className="font-serif text-lg">{item.titulo}</span>
              <span className="text-xs text-muted shrink-0">{item.categoria}</span>
            </li>
          ))}
          {!carregando && resultados.length === 0 && (
            <li className="py-8 text-center text-muted">Nenhum conteúdo encontrado.</li>
          )}
        </ul>
      </div>
    </>
  );
}
