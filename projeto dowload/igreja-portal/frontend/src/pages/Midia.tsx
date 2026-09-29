import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ImagePanel from "../components/ui/ImagePanel";
import { apiGet } from "../lib/api";
import { tomPorId } from "../lib/format";
import { useSiteData } from "../context/SiteDataContext";
import type { Midia as MidiaItem } from "../types";

export default function Midia() {
  const { config } = useSiteData();
  const [itens, setItens] = useState<MidiaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    apiGet<MidiaItem[]>("/midias")
      .then(setItens)
      .catch(() => setItens([]))
      .finally(() => setCarregando(false));
  }, []);

  const categorias = useMemo(
    () => ["Todos", ...Array.from(new Set(itens.map((i) => i.categoria)))],
    [itens]
  );
  const filtrados = filtro === "Todos" ? itens : itens.filter((i) => i.categoria === filtro);

  return (
    <>
      <PageHeader
        eyebrow="Central multimídia"
        title="Mídia"
        description="Pregações, transmissões, podcasts e fotos da nossa igreja."
      />

      <div className="container-page py-16">
        {carregando && <p className="text-muted text-sm">Carregando...</p>}

        {!carregando && itens.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setFiltro(c)}
                className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
                  filtro === c
                    ? "border-primary bg-primary text-white"
                    : "border-line text-ink/70 hover:border-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {!carregando && itens.length === 0 && (
          <p className="text-muted text-sm">Nenhum conteúdo de mídia publicado ainda.</p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="border border-line rounded-sm overflow-hidden block">
              <ImagePanel tone={tomPorId(item.id)} icon="livro" className="aspect-video w-full" />
              <div className="p-5">
                <span className="text-xs font-medium text-accent-dark">{item.categoria}</span>
                <h3 className="font-serif text-base mt-1">{item.titulo}</h3>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 border border-line rounded-sm p-6 bg-white flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted max-w-sm">
            Acompanhe também nosso conteúdo diretamente nas redes sociais.
          </p>
          <div className="flex gap-3">
            <a href={config.youtube_url} className="btn-ghost">
              YouTube
            </a>
            <a href={config.instagram_url} className="btn-ghost">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
