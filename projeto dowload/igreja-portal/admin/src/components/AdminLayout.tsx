import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/", label: "Painel", end: true },
  { to: "/noticias", label: "Notícias" },
  { to: "/eventos", label: "Eventos" },
  { to: "/cultos", label: "Cultos" },
  { to: "/lideranca", label: "Liderança" },
  { to: "/ministerios", label: "Ministérios" },
  { to: "/congregacoes", label: "Congregações" },
  { to: "/estudos", label: "Estudos" },
  { to: "/midias", label: "Mídia" },
  { to: "/banners", label: "Banners" },
  { to: "/pedidos-oracao", label: "Pedidos de oração" },
  { to: "/mensagens", label: "Mensagens de contato" },
  { to: "/configuracoes", label: "Configurações" },
];

export default function AdminLayout() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate("/entrar");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-line bg-white hidden md:flex md:flex-col">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-line">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-accent-soft shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v18M6 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-serif text-sm leading-tight">Painel admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-5 py-2.5 text-sm ${
                  isActive ? "bg-primary/5 text-primary font-medium" : "text-ink/75 hover:bg-primary/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-line bg-white flex items-center justify-between px-5">
          <span className="text-sm text-muted md:hidden font-serif">Painel admin</span>
          <span className="hidden md:block" />
          <div className="flex items-center gap-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium">{usuario?.nome}</p>
              <p className="text-xs text-muted capitalize">{usuario?.papel}</p>
            </div>
            <button onClick={handleSair} className="btn-outline">
              Sair
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
