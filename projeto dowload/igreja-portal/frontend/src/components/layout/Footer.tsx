import { Link } from "react-router-dom";
import { menuPrincipal } from "../../config/site";
import { useSiteData } from "../../context/SiteDataContext";
import { nomeDiaSemana, formatarHorario } from "../../lib/format";

export default function Footer() {
  const { config, cultos } = useSiteData();

  const redes = [
    { nome: "Instagram", href: config.instagram_url },
    { nome: "YouTube", href: config.youtube_url },
    { nome: "Facebook", href: config.facebook_url },
  ];

  return (
    <footer className="bg-primary-dark text-white/85">
      <div className="container-page py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent-soft/90 text-primary-dark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v18M6 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="font-serif text-base text-white">{config.nome_igreja}</span>
          </div>
          <p className="text-sm text-white/65 max-w-xs">{config.slogan}</p>
          <div className="flex gap-3 pt-1">
            {redes.map((r) => (
              <a
                key={r.nome}
                href={r.href}
                className="text-xs text-white/70 hover:text-accent-soft underline underline-offset-4"
              >
                {r.nome}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-4">Links rápidos</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70">
            {menuPrincipal.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:text-accent-soft">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-4">Cultos</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70">
            {cultos.map((c) => (
              <li key={c.id} className="flex justify-between gap-3">
                <span>{nomeDiaSemana(c.dia_semana)}</span>
                <span className="text-white/50">{formatarHorario(c.horario)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-4">Contato</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70">
            <li>{config.endereco}</li>
            <li>{config.telefone}</li>
            <li>{config.email}</li>
          </ul>
          <div className="mt-5 flex flex-col gap-2">
            <Link to="/midia" className="btn-outline">
              Culto ao vivo
            </Link>
            <Link to="/contribua" className="btn-primary">
              Contribua
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {config.nome_igreja}. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="/privacidade" className="hover:text-white/80">
              Política de privacidade
            </Link>
            <Link to="/termos" className="hover:text-white/80">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
