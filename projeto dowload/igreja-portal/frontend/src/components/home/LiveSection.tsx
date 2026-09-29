import { Link } from "react-router-dom";
import { useSiteData } from "../../context/SiteDataContext";

export default function LiveSection() {
  const { config } = useSiteData();
  const aoVivo = config.transmissao_ao_vivo === "true";

  return (
    <section className="bg-primary-dark text-white">
      <div className="container-page py-16 sm:py-20 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="aspect-video w-full rounded-sm bg-black/30 border border-white/10 flex items-center justify-center">
          {aoVivo ? (
            <a
              href={config.youtube_url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 text-white"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                </svg>
              </span>
              <span className="text-sm">Assistir agora no YouTube</span>
            </a>
          ) : (
            <div className="text-center px-6">
              <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/25">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                </svg>
              </span>
              <p className="text-white/70 text-sm">
                Não estamos transmitindo ao vivo neste momento.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <span className="eyebrow text-accent-soft">Transmissão</span>
          <h2 className="font-serif text-3xl sm:text-4xl leading-tight">Culto ao vivo</h2>
          <p className="text-white/70 max-w-md">
            Acompanhe nossos cultos ao vivo pelo YouTube, onde quer que você esteja.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={config.youtube_url} className="btn-primary">
              Ver próxima transmissão
            </a>
            <Link to="/midia" className="btn-outline">
              Canal no YouTube
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
