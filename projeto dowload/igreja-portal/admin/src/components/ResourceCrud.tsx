import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut, ApiError } from "../lib/api";

export interface CampoFormulario {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "select" | "datetime-local" | "horario";
  options?: { value: string; label: string }[];
  required?: boolean;
  numeric?: boolean;
}

export interface ColunaTabela {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

export interface ResourceConfig {
  titulo: string;
  descricao?: string;
  listPath: string;
  basePath: string;
  idField?: string;
  colunas: ColunaTabela[];
  campos: CampoFormulario[];
  permitirExcluir?: boolean;
}

function valorInicial(campos: CampoFormulario[], item?: any) {
  const base: Record<string, any> = {};
  for (const campo of campos) {
    if (item && item[campo.name] !== undefined && item[campo.name] !== null) {
      let valor = item[campo.name];
      if (campo.type === "datetime-local" && typeof valor === "string") {
        valor = valor.slice(0, 16);
      }
      base[campo.name] = valor;
    } else {
      base[campo.name] = campo.type === "boolean" ? false : "";
    }
  }
  return base;
}

export default function ResourceCrud({ config }: { config: ResourceConfig }) {
  const idField = config.idField ?? "id";
  const [itens, setItens] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState<any | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<Record<string, any>>(valorInicial(config.campos));
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const dados = await apiGet<any[]>(config.listPath);
      setItens(dados);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.listPath]);

  function abrirNovo() {
    setEditando(null);
    setForm(valorInicial(config.campos));
    setErroForm("");
    setMostrarForm(true);
  }

  function abrirEdicao(item: any) {
    setEditando(item);
    setForm(valorInicial(config.campos, item));
    setErroForm("");
    setMostrarForm(true);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErroForm("");
    try {
      const payload: Record<string, any> = {};
      for (const campo of config.campos) {
        const valor = form[campo.name];
        if (campo.type === "number" || campo.numeric) payload[campo.name] = valor === "" ? undefined : Number(valor);
        else if (campo.type === "boolean") payload[campo.name] = Boolean(valor);
        else payload[campo.name] = valor === "" ? undefined : valor;
      }

      if (editando) {
        await apiPut(`${config.basePath}/${editando[idField]}`, payload);
      } else {
        await apiPost(config.basePath, payload);
      }
      setMostrarForm(false);
      await carregar();
    } catch (err) {
      setErroForm(err instanceof ApiError ? err.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(item: any) {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      await apiDelete(`${config.basePath}/${item[idField]}`);
      await carregar();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Não foi possível excluir.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl">{config.titulo}</h1>
          {config.descricao && <p className="text-sm text-muted mt-1">{config.descricao}</p>}
        </div>
        <button onClick={abrirNovo} className="btn-primary">
          Novo
        </button>
      </div>

      {erro && <p className="text-sm text-red-700 mb-4">{erro}</p>}

      <div className="border border-line rounded-sm overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              {config.colunas.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={config.colunas.length + 1}>
                  Carregando...
                </td>
              </tr>
            )}
            {!carregando && itens.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={config.colunas.length + 1}>
                  Nenhum item cadastrado.
                </td>
              </tr>
            )}
            {itens.map((item) => (
              <tr key={item[idField]} className="border-b border-line last:border-0">
                {config.colunas.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-top">
                    {c.render ? c.render(item) : String(item[c.key] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => abrirEdicao(item)} className="text-primary text-sm font-medium hover:underline mr-4">
                    Editar
                  </button>
                  {config.permitirExcluir !== false && (
                    <button onClick={() => excluir(item)} className="btn-danger">
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-white rounded-sm border border-line max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-serif text-lg">{editando ? "Editar" : "Novo"} — {config.titulo}</h2>
              <button onClick={() => setMostrarForm(false)} className="text-muted hover:text-ink">
                ✕
              </button>
            </div>
            <form onSubmit={salvar} className="px-6 py-5 flex flex-col gap-4">
              {config.campos.map((campo) => (
                <div key={campo.name}>
                  <label className="block text-sm font-medium mb-1.5">{campo.label}</label>
                  {campo.type === "textarea" && (
                    <textarea
                      className="input"
                      rows={4}
                      required={campo.required}
                      value={form[campo.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })}
                    />
                  )}
                  {campo.type === "boolean" && (
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={Boolean(form[campo.name])}
                      onChange={(e) => setForm({ ...form, [campo.name]: e.target.checked })}
                    />
                  )}
                  {campo.type === "select" && (
                    <select
                      className="input"
                      required={campo.required}
                      value={form[campo.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })}
                    >
                      <option value="" disabled>
                        Selecione...
                      </option>
                      {campo.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {campo.type === "number" && (
                    <input
                      type="number"
                      className="input"
                      required={campo.required}
                      value={form[campo.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })}
                    />
                  )}
                  {campo.type === "datetime-local" && (
                    <input
                      type="datetime-local"
                      className="input"
                      required={campo.required}
                      value={form[campo.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })}
                    />
                  )}
                  {campo.type === "horario" && (
                    <input
                      type="time"
                      className="input"
                      required={campo.required}
                      value={form[campo.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })}
                    />
                  )}
                  {campo.type === "text" && (
                    <input
                      type="text"
                      className="input"
                      required={campo.required}
                      value={form[campo.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}

              {erroForm && <p className="text-sm text-red-700">{erroForm}</p>}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={salvando} className="btn-primary disabled:opacity-60">
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" onClick={() => setMostrarForm(false)} className="btn-outline">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
