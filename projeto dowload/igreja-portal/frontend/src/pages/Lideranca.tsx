import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ImagePanel from "../components/ui/ImagePanel";
import { apiGet } from "../lib/api";
import { tomPorId } from "../lib/format";
import type { CategoriaLideranca, Lider } from "../types";

const categorias: { valor: CategoriaLideranca; label: string }[] = [
  { valor: "presidencia", label: "Presidência" },
  { valor: "pastores", label: "Pastores" },
  { valor: "evangelistas", label: "Evangelistas" },
  { valor: "presbiteros", label: "Presbíteros" },
  { valor: "diaconos", label: "Diáconos" },
  { valor: "lideres_departamento", label: "Líderes de Departamento" },
];

export default function Lideranca() {
  const [lideres, setLideres] = useState<Lider[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiGet<Lider[]>("/lideranca")
      .then(setLideres)
      .catch(() => setLideres([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Quem somos"
        title="Liderança"
        description="Conheça os pastores e líderes que servem à nossa igreja."
      />

      <div className="container-page py-16 flex flex-col gap-14">
        {carregando && <p className="text-muted text-sm">Carregando...</p>}

        {categorias.map((categoria) => {
          const membros = lideres.filter((l) => l.categoria === categoria.valor);
          if (membros.length === 0) return null;

          return (
            <section key={categoria.valor}>
              <h2 className="font-serif text-2xl mb-6">{categoria.label}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {membros.map((lider) => (
                  <div key={lider.id} className="border border-line rounded-sm overflow-hidden">
                    <ImagePanel tone={tomPorId(lider.id)} icon="pessoas" className="aspect-[4/3] w-full" />
                    <div className="p-5">
                      <h3 className="font-serif text-lg">{lider.nome}</h3>
                      <p className="text-sm text-accent-dark mb-2">{lider.funcao}</p>
                      <p className="text-sm text-muted">{lider.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
