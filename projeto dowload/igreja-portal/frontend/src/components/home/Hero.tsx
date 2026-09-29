import { Link } from "react-router-dom";
import ImagePanel from "../ui/ImagePanel";
import { useSiteData } from "../../context/SiteDataContext";

export default function Hero() {
  const { config } = useSiteData();

  return (
    <section className="bg-white">
      <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <span className="eyebrow">{config.nome_igreja}</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.08] font-medium max-w-xl">
            {config.slogan}
          </h1>
          <p className="text-muted text-lg max-w-md">
            Um lugar de comunhão, adoração, ensino da Palavra e serviço ao próximo.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/a-igreja" className="btn-primary">
              Conheça nossa igreja
            </Link>
            <Link to="/eventos" className="btn-ghost">
              Cultos e horários
            </Link>
          </div>
        </div>

        <ImagePanel
          tone="primary"
          icon="pessoas"
          label="Congregação reunida em culto"
          className="aspect-[4/3] w-full rounded-sm"
        />
      </div>
    </section>
  );
}
