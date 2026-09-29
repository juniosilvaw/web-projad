import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ImagePanel from "../components/ui/ImagePanel";
import { apiPost, ApiError } from "../lib/api";
import { useSiteData } from "../context/SiteDataContext";

export default function Contato() {
  const { config } = useSiteData();
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nome = String(form.get("nome") || "").trim();
    const email = String(form.get("email") || "").trim();
    const mensagem = String(form.get("mensagem") || "").trim();

    if (!nome || !email || !mensagem) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      setEnviado(false);
      return;
    }

    setErro("");
    setEnviando(true);
    try {
      await apiPost("/contato", { nome, email, mensagem });
      setEnviado(true);
      e.currentTarget.reset();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Não foi possível enviar sua mensagem agora.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Fale conosco" title="Contato" description="Estamos à disposição para atendê-lo." />

      <div className="container-page py-16 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-8">
          <ImagePanel tone="primary" icon="cruz" className="aspect-[4/3] w-full rounded-sm" label="Mapa de localização" />
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="font-medium text-ink">Endereço</dt>
              <dd className="text-muted">{config.endereco}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Telefone</dt>
              <dd className="text-muted">{config.telefone}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">WhatsApp</dt>
              <dd className="text-muted">{config.whatsapp}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">E-mail</dt>
              <dd className="text-muted">{config.email}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-1.5">
              Nome
            </label>
            <input id="nome" name="nome" type="text" required className="w-full rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              E-mail
            </label>
            <input id="email" name="email" type="email" required className="w-full rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium mb-1.5">
              Mensagem
            </label>
            <textarea id="mensagem" name="mensagem" rows={5} required className="w-full rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>

          {erro && <p className="text-sm text-red-700">{erro}</p>}
          {enviado && (
            <p className="text-sm text-primary">
              Mensagem enviada com sucesso. Em breve entraremos em contato.
            </p>
          )}

          <button type="submit" disabled={enviando} className="btn-primary self-start mt-2 disabled:opacity-60">
            {enviando ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
      </div>
    </>
  );
}
