import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImagePanel from "../components/ui/ImagePanel";
import { apiGet, ApiError } from "../lib/api";
import { formatarData, tomPorId } from "../lib/format";
import type { Evento } from "../types";

export default function EventoDetalhe() {
  const { id } = useParams();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiGet<Evento>(`/eventos/${id}`)
      .then(setEvento)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNaoEncontrado(true);
      })
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return <div className="container-page py-20 text-muted text-sm">Carregando...</div>;
  }

  if (naoEncontrado || !evento) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-2xl mb-3">Evento não encontrado</h1>
        <Link to="/eventos" className="text-primary hover:underline">
          Voltar para eventos
        </Link>
      </div>
    );
  }

  return (
    <article>
      <ImagePanel tone={tomPorId(evento.id)} icon="cruz" className="aspect-[21/9] w-full" label={evento.nome} />
      <div className="container-page py-14 max-w-prose">
        <Link to="/eventos" className="text-sm text-primary hover:underline">
          ← Voltar para eventos
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl mt-4 mb-4">{evento.nome}</h1>
        <p className="text-muted mb-6">
          {formatarData(evento.data_inicio, { weekday: "long" })}
          {evento.local ? ` · ${evento.local}` : ""}
        </p>
        <p className="text-ink leading-relaxed whitespace-pre-line">{evento.descricao}</p>
      </div>
    </article>
  );
}
