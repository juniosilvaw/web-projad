import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ImagePanel from "../components/ui/ImagePanel";
import { apiGet } from "../lib/api";
import { formatarData, tomPorId } from "../lib/format";
import type { Evento } from "../types";

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiGet<Evento[]>("/eventos")
      .then(setEventos)
      .catch(() => setEventos([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Agenda" title="Eventos" description="Confira a programação de eventos da nossa igreja." />

      <div className="container-page py-16">
        {carregando && <p className="text-muted text-sm">Carregando...</p>}
        {!carregando && eventos.length === 0 && (
          <p className="text-muted text-sm">Nenhum evento programado no momento.</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <Link
              key={evento.id}
              to={`/eventos/${evento.slug}`}
              className="flex flex-col border border-line rounded-sm overflow-hidden group"
            >
              <ImagePanel tone={tomPorId(evento.id)} icon="cruz" className="aspect-[16/10] w-full" />
              <div className="p-6 flex flex-col gap-2">
                <span className="text-xs font-medium text-accent-dark">{formatarData(evento.data_inicio)}</span>
                <h2 className="font-serif text-lg group-hover:text-primary">{evento.nome}</h2>
                <p className="text-sm text-muted">{evento.local}</p>
                <p className="text-sm text-muted">{evento.descricao}</p>
                <span className="text-primary text-sm font-medium mt-2">Saiba mais</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
