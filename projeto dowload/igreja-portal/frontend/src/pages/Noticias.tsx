import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ImagePanel from "../components/ui/ImagePanel";
import { apiGet } from "../lib/api";
import { formatarData, tomPorId } from "../lib/format";
import type { Noticia } from "../types";

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    apiGet<Noticia[]>("/noticias")
      .then(setNoticias)
      .catch(() => setErro("Não foi possível carregar as notícias."))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Fique por dentro" title="Notícias" description="Acompanhe as últimas notícias da nossa igreja." />

      <div className="container-page py-16">
        {carregando && <p className="text-muted text-sm">Carregando...</p>}
        {erro && <p className="text-sm text-red-700">{erro}</p>}
        {!carregando && noticias.length === 0 && !erro && (
          <p className="text-muted text-sm">Nenhuma notícia publicada ainda.</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <Link
              key={noticia.id}
              to={`/noticias/${noticia.slug}`}
              className="flex flex-col border border-line rounded-sm overflow-hidden group"
            >
              <ImagePanel tone={tomPorId(noticia.id)} icon="livro" className="aspect-[16/10] w-full" />
              <div className="p-6 flex flex-col gap-2">
                <span className="text-xs font-medium text-accent-dark">{noticia.categoria}</span>
                <h2 className="font-serif text-lg leading-snug group-hover:text-primary">{noticia.titulo}</h2>
                <p className="text-sm text-muted">{noticia.resumo}</p>
                <span className="text-xs text-muted mt-2">{formatarData(noticia.publicado_em)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
