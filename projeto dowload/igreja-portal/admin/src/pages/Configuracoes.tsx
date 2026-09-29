import { useEffect, useState } from "react";
import { apiGet, apiPut, ApiError } from "../lib/api";

const campos: { chave: string; label: string; tipo?: "text" | "textarea" }[] = [
  { chave: "nome_igreja", label: "Nome da igreja" },
  { chave: "slogan", label: "Slogan" },
  { chave: "endereco", label: "Endereço" },
  { chave: "telefone", label: "Telefone" },
  { chave: "whatsapp", label: "WhatsApp" },
  { chave: "email", label: "E-mail" },
  { chave: "instagram_url", label: "URL do Instagram" },
  { chave: "youtube_url", label: "URL do canal do YouTube" },
  { chave: "facebook_url", label: "URL do Facebook" },
  { chave: "pix_chave", label: "Chave PIX" },
  { chave: "pix_favorecido", label: "Nome do favorecido (PIX)" },
];

export default function Configuracoes() {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    apiGet<Record<string, string>>("/configuracoes")
      .then(setValores)
      .catch((err) => setErro(err instanceof ApiError ? err.message : "Não foi possível carregar."))
      .finally(() => setCarregando(false));
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");
    setErro("");
    try {
      await apiPut("/configuracoes", valores);
      setMensagem("Configurações salvas com sucesso.");
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p className="text-muted text-sm">Carregando...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl mb-2">Configurações</h1>
      <p className="text-sm text-muted mb-6">
        Informações de contato, redes sociais e chave PIX exibidas no site público.
      </p>

      <form onSubmit={salvar} className="flex flex-col gap-4">
        {campos.map((campo) => (
          <div key={campo.chave}>
            <label className="block text-sm font-medium mb-1.5">{campo.label}</label>
            <input
              type="text"
              className="input"
              value={valores[campo.chave] ?? ""}
              onChange={(e) => setValores({ ...valores, [campo.chave]: e.target.value })}
            />
          </div>
        ))}

        {erro && <p className="text-sm text-red-700">{erro}</p>}
        {mensagem && <p className="text-sm text-primary">{mensagem}</p>}

        <button type="submit" disabled={salvando} className="btn-primary self-start mt-2 disabled:opacity-60">
          {salvando ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}
