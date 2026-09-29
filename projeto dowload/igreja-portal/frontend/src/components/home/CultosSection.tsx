import { Link } from "react-router-dom";
import { useSiteData } from "../../context/SiteDataContext";
import { nomeDiaSemana, formatarHorario } from "../../lib/format";
import SectionHeading from "../ui/SectionHeading";

export default function CultosSection() {
  const { cultos, carregando } = useSiteData();

  return (
    <section className="bg-canvas">
      <div className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Programação semanal"
          title="Nossos cultos"
          description="Venha participar de um de nossos encontros ao longo da semana — há um lugar para você."
        />

        {carregando && <p className="text-muted text-sm mt-10">Carregando...</p>}

        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {cultos.map((culto) => (
            <div key={culto.id} className="flex flex-col gap-2 bg-white p-6">
              <span className="text-xs font-medium text-accent-dark">{nomeDiaSemana(culto.dia_semana)}</span>
              <h3 className="font-serif text-xl">{culto.nome}</h3>
              <p className="text-sm text-muted">{culto.descricao}</p>
              <span className="mt-auto pt-4 text-lg font-medium text-primary">
                {formatarHorario(culto.horario)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link to="/eventos" className="btn-ghost">
            Ver toda a agenda
          </Link>
        </div>
      </div>
    </section>
  );
}
