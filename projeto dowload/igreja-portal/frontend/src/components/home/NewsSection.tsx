import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import { formatarData, tomPorId } from "../../lib/format";
import ImagePanel from "../ui/ImagePanel";
import SectionHeading from "../ui/SectionHeading";
import type { Noticia } from "../../types";

export default function NewsSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiGet<Noticia[]>("/noticias")
      .then((dados) => setNoticias(dados.slice(0, 3)))
      .catch(() => setNoticias([]))
      .finally(() => setCarregando(false));
  }, []);

  if (!carregando && noticias.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow="Fique por dentro" title="Notícias" />

        {carregando && <p className="text-muted text-sm mt-10">Carregando...</p>}

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <article key={noticia.id} className="flex flex-col border border-line rounded-sm overflow-hidden">
              <ImagePanel tone={tomPorId(noticia.id)} icon="livro" className="aspect-[16/10] w-full" />
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="text-xs font-medium text-accent-dark">{noticia.categoria}</span>
                <h3 className="font-serif text-lg leading-snug">{noticia.titulo}</h3>
                <p className="text-sm text-muted flex-1">{noticia.resumo}</p>
                <div className="flex items-center justify-between pt-2 text-sm">
                  <span className="text-muted">{formatarData(noticia.publicado_em)}</span>
                  <Link to={`/noticias/${noticia.slug}`} className="text-primary font-medium hover:underline">
                    Leia mais
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
