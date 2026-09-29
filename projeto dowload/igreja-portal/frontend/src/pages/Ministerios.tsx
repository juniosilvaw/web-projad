import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ImagePanel from "../components/ui/ImagePanel";
import { apiGet } from "../lib/api";
import { tomPorId } from "../lib/format";
import type { Ministerio } from "../types";

export default function Ministerios() {
  const [ministerios, setMinisterios] = useState<Ministerio[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiGet<Ministerio[]>("/ministerios")
      .then(setMinisterios)
      .catch(() => setMinisterios([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Sirva e cresça"
        title="Ministérios"
        description="Encontre um espaço para servir, aprender e viver em comunhão."
      />

      <div className="container-page py-16">
        {carregando && <p className="text-muted text-sm">Carregando...</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministerios.map((m) => (
            <div key={m.id} className="flex flex-col border border-line rounded-sm overflow-hidden">
              <ImagePanel tone={tomPorId(m.id)} icon="pomba" className="aspect-[16/10] w-full" />
              <div className="flex flex-1 flex-col gap-2 p-6">
                <h2 className="font-serif text-lg">{m.nome}</h2>
                <p className="text-sm text-muted flex-1">{m.descricao}</p>
                <dl className="mt-3 text-sm text-muted flex flex-col gap-1">
                  {m.lideranca && (
                    <div className="flex gap-2">
                      <dt className="font-medium text-ink">Liderança:</dt>
                      <dd>{m.lideranca}</dd>
                    </div>
                  )}
                  {m.horarios && (
                    <div className="flex gap-2">
                      <dt className="font-medium text-ink">Horários:</dt>
                      <dd>{m.horarios}</dd>
                    </div>
                  )}
                  {m.contato && (
                    <div className="flex gap-2">
                      <dt className="font-medium text-ink">Contato:</dt>
                      <dd>{m.contato}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
