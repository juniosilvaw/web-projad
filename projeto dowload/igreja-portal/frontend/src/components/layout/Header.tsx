import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { menuPrincipal } from "../../config/site";
import { useSiteData } from "../../context/SiteDataContext";

export default function Header() {
  const { config } = useSiteData();
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 bg-canvas/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_#DED6C3]" : ""
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-accent-soft">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v18M6 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="hidden sm:block leading-tight">
            <span className="block font-serif text-base font-medium text-ink">
              {config.nome_igreja}
            </span>
            <span className="block text-xs text-muted">Assembleia de Deus</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Menu principal">
          {menuPrincipal.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-primary ${
                  isActive ? "text-primary font-medium" : "text-ink/80"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBuscaAberta((v) => !v)}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-sm text-ink/70 hover:bg-primary/5 hover:text-primary"
            aria-label="Abrir pesquisa"
            aria-expanded={buscaAberta}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/midia" className="hidden md:inline-flex btn-ghost">
            <span className="h-2 w-2 rounded-full bg-red-600" aria-hidden="true" />
            Culto ao vivo
          </Link>
          <Link to="/contribua" className="hidden md:inline-flex btn-primary">
            Contribua
          </Link>

          <button
            type="button"
            onClick={() => setMenuAberto((v) => !v)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-sm text-ink hover:bg-primary/5"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
          >
            {menuAberto ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {buscaAberta && (
        <div className="border-t border-line bg-canvas">
          <form
            className="container-page flex items-center gap-3 py-3"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="busca-site" className="sr-only">
              Pesquisar no site
            </label>
            <input
              id="busca-site"
              type="search"
              placeholder="Pesquisar notícias, estudos, eventos..."
              className="w-full rounded-sm border border-line bg-white px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="btn-ghost shrink-0">
              Buscar
            </button>
          </form>
        </div>
      )}

      {menuAberto && (
        <nav
          className="lg:hidden border-t border-line bg-canvas px-5 py-4"
          aria-label="Menu principal (mobile)"
        >
          <ul className="flex flex-col gap-1">
            {menuPrincipal.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `block rounded-sm px-2 py-2.5 text-sm ${
                      isActive ? "bg-primary/5 text-primary font-medium" : "text-ink/80"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/midia" className="btn-ghost w-full">
              Culto ao vivo
            </Link>
            <Link to="/contribua" className="btn-primary w-full">
              Contribua
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
