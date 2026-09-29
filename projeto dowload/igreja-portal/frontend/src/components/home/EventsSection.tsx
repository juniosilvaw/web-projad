import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import { tomPorId } from "../../lib/format";
import ImagePanel from "../ui/ImagePanel";
import SectionHeading from "../ui/SectionHeading";
import type { Evento } from "../../types";

const formatarDataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export default function EventsSection() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiGet<Evento[]>("/eventos")
      .then((dados) => setEventos(dados.slice(0, 4)))
      .catch(() => setEventos([]))
      .finally(() => setCarregando(false));
  }, []);

  if (!carregando && eventos.length === 0) return null;

  return (
    <section className="bg-canvas">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Agenda" title="Próximos eventos" />
          <Link to="/eventos" className="btn-ghost">
            Ver todos os eventos
          </Link>
        </div>

        {carregando && <p className="text-muted text-sm mt-10">Carregando...</p>}

        <div className="mt-10 flex flex-col divide-y divide-line border-y border-line">
          {eventos.map((evento) => (
            <Link
              key={evento.id}
              to={`/eventos/${evento.slug}`}
              className="flex items-center gap-6 py-5 group"
            >
              <ImagePanel tone={tomPorId(evento.id)} icon="cruz" className="h-16 w-16 shrink-0 rounded-sm" />
              <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h3 className="font-serif text-lg group-hover:text-primary">{evento.nome}</h3>
                  <p className="text-sm text-muted">{evento.local}</p>
                </div>
                <div className="text-sm text-muted sm:text-right">
                  <p className="text-ink font-medium">{formatarDataCurta(evento.data_inicio)}</p>
                  <p>{formatarHora(evento.data_inicio)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
