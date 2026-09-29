import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImagePanel from "../components/ui/ImagePanel";
import { apiGet, ApiError } from "../lib/api";
import { formatarData, tomPorId } from "../lib/format";
import type { Noticia } from "../types";

export default function NoticiaDetalhe() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiGet<Noticia>(`/noticias/${id}`)
      .then(setNoticia)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNaoEncontrada(true);
      })
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return <div className="container-page py-20 text-muted text-sm">Carregando...</div>;
  }

  if (naoEncontrada || !noticia) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-2xl mb-3">Notícia não encontrada</h1>
        <Link to="/noticias" className="text-primary hover:underline">
          Voltar para notícias
        </Link>
      </div>
    );
  }

  return (
    <article>
      <ImagePanel tone={tomPorId(noticia.id)} icon="livro" className="aspect-[21/9] w-full" label={noticia.titulo} />
      <div className="container-page py-14 max-w-prose">
        <Link to="/noticias" className="text-sm text-primary hover:underline">
          ← Voltar para notícias
        </Link>
        <span className="eyebrow mt-6 block">{noticia.categoria}</span>
        <h1 className="font-serif text-3xl sm:text-4xl mt-2 mb-4">{noticia.titulo}</h1>
        <p className="text-muted mb-6">{formatarData(noticia.publicado_em)}</p>
        <p className="text-ink leading-relaxed whitespace-pre-line">{noticia.conteudo}</p>
      </div>
    </article>
  );
}
