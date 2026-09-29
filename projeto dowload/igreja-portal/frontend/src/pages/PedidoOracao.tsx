import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { apiPost, ApiError } from "../lib/api";

export default function PedidoOracao() {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const anonimo = form.get("anonimo") === "on";
    const nome = String(form.get("nome") || "").trim();
    const email = String(form.get("email") || "").trim();
    const telefone = String(form.get("telefone") || "").trim();
    const pedido = String(form.get("pedido") || "").trim();

    if (!pedido) {
      setErro("Por favor, escreva seu pedido de oração.");
      setEnviado(false);
      return;
    }
    if (!anonimo && (!nome || !email)) {
      setErro("Informe nome e e-mail, ou marque a opção de anonimato.");
      setEnviado(false);
      return;
    }

    setErro("");
    setEnviando(true);
    try {
      await apiPost("/pedidos-oracao", { nome, email, telefone, pedido, anonimo });
      setEnviado(true);
      e.currentTarget.reset();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Não foi possível enviar seu pedido agora.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Estamos com você"
        title="Pedido de oração"
        description="Compartilhe seu pedido com nossa equipe de intercessão. Toda a igreja orará com você."
      />

      <div className="container-page py-16 max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-1.5">
              Nome
            </label>
            <input id="nome" name="nome" type="text" className="w-full rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              E-mail
            </label>
            <input id="email" name="email" type="email" className="w-full rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium mb-1.5">
              Telefone
            </label>
            <input id="telefone" name="telefone" type="tel" className="w-full rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label htmlFor="pedido" className="block text-sm font-medium mb-1.5">
              Pedido de oração
            </label>
            <textarea id="pedido" name="pedido" rows={5} required className="w-full rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input name="anonimo" type="checkbox" className="h-4 w-4 rounded-sm border-line" />
            Desejo manter meu pedido em anonimato
          </label>

          {erro && <p className="text-sm text-red-700">{erro}</p>}
          {enviado && (
            <p className="text-sm text-primary">
              Pedido enviado com sucesso. Nossa equipe de intercessão estará orando por você.
            </p>
          )}

          <button type="submit" disabled={enviando} className="btn-primary self-start mt-2 disabled:opacity-60">
            {enviando ? "Enviando..." : "Enviar pedido"}
          </button>
        </form>
      </div>
    </>
  );
}
