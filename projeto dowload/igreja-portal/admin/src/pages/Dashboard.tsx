import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Resumo {
  pedidosPendentes: number;
  mensagensNaoLidas: number;
  noticiasPublicadas: number;
  proximosEventos: number;
}

export default function Dashboard() {
  const { usuario } = useAuth();
  const [resumo, setResumo] = useState<Resumo | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet<any[]>("/pedidos-oracao"),
      apiGet<any[]>("/contato"),
      apiGet<any[]>("/noticias"),
      apiGet<any[]>("/eventos"),
    ])
      .then(([pedidos, mensagens, noticias, eventos]) => {
        setResumo({
          pedidosPendentes: pedidos.filter((p) => !p.atendido).length,
          mensagensNaoLidas: mensagens.filter((m) => !m.lida).length,
          noticiasPublicadas: noticias.length,
          proximosEventos: eventos.length,
        });
      })
      .catch(() => setResumo(null));
  }, []);

  const cards = [
    { label: "Pedidos de oração pendentes", valor: resumo?.pedidosPendentes, to: "/pedidos-oracao" },
    { label: "Mensagens não lidas", valor: resumo?.mensagensNaoLidas, to: "/mensagens" },
    { label: "Notícias publicadas", valor: resumo?.noticiasPublicadas, to: "/noticias" },
    { label: "Próximos eventos", valor: resumo?.proximosEventos, to: "/eventos" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl mb-1">Olá, {usuario?.nome?.split(" ")[0]}</h1>
      <p className="text-sm text-muted mb-8">Visão geral do conteúdo do site.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="border border-line rounded-sm bg-white p-5 hover:border-primary">
            <p className="text-3xl font-serif">{c.valor ?? "—"}</p>
            <p className="text-sm text-muted mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
