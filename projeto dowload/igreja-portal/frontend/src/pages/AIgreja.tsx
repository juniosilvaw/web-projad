import PageHeader from "../components/ui/PageHeader";
import ImagePanel from "../components/ui/ImagePanel";

const linhaDoTempo = [
  { ano: "[Ano a configurar]", texto: "Fundação da igreja com um pequeno grupo de famílias reunidas em oração." },
  { ano: "[Ano a configurar]", texto: "Construção do primeiro templo e início dos cultos regulares." },
  { ano: "[Ano a configurar]", texto: "Abertura da primeira congregação em outro bairro da cidade." },
  { ano: "[Ano a configurar]", texto: "Criação da Escola Bíblica Dominical e dos primeiros ministérios organizados." },
  { ano: "Hoje", texto: "Uma igreja em crescimento, com múltiplas congregações e ministérios ativos." },
];

const valores = [
  { titulo: "A Palavra de Deus", texto: "Cremos na Bíblia como Palavra inspirada por Deus e nossa regra de fé e prática." },
  { titulo: "Comunhão", texto: "Valorizamos a vida em comunidade e o cuidado mútuo entre os membros da igreja." },
  { titulo: "Serviço", texto: "Servimos à igreja e à comunidade como expressão prática do amor de Cristo." },
  { titulo: "Missão", texto: "Somos comprometidos com o anúncio do evangelho em nossa cidade e além dela." },
];

export default function AIgreja() {
  return (
    <>
      <PageHeader
        eyebrow="Institucional"
        title="A nossa igreja"
        description="Conheça a história, a missão e os valores que nos guiam como comunidade de fé."
      />

      <section className="bg-white">
        <div className="container-page py-16 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl sm:text-3xl">Nossa história</h2>
            <p className="text-muted max-w-prose">
              [Texto institucional a configurar: conte aqui a história da fundação da igreja, os
              principais marcos e o crescimento ao longo dos anos, com base nos registros reais da
              congregação.]
            </p>
          </div>
          <ImagePanel tone="primary-light" icon="livro" className="aspect-[4/3] w-full rounded-sm" />
        </div>
      </section>

      <section className="bg-canvas">
        <div className="container-page py-16">
          <h2 className="font-serif text-2xl sm:text-3xl mb-10">Linha do tempo</h2>
          <ol className="flex flex-col gap-8 border-l border-line pl-6">
            {linhaDoTempo.map((item, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full bg-accent" />
                <span className="text-sm font-medium text-accent-dark">{item.ano}</span>
                <p className="text-ink mt-1 max-w-prose">{item.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-16 grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl mb-3">Missão</h2>
            <p className="text-muted max-w-prose">
              Fazer discípulos de Cristo, edificando vidas por meio da Palavra, da adoração e do
              serviço ao próximo.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl mb-3">Visão</h2>
            <p className="text-muted max-w-prose">
              Ser uma igreja acolhedora e relevante, alcançando famílias e formando líderes
              comprometidos com o Reino de Deus.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="container-page py-16">
          <h2 className="font-serif text-2xl sm:text-3xl mb-10">Nossos valores</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v) => (
              <div key={v.titulo} className="border border-line rounded-sm p-6 bg-white">
                <h3 className="font-serif text-lg mb-2">{v.titulo}</h3>
                <p className="text-sm text-muted">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-16">
          <h2 className="font-serif text-2xl sm:text-3xl mb-4">Declaração de fé</h2>
          <p className="text-muted max-w-prose">
            [Texto a configurar: inserir aqui a declaração de fé oficial da igreja, cobrindo as
            doutrinas centrais — as Escrituras, a Trindade, a salvação, o batismo nas águas, o
            batismo no Espírito Santo e a segunda vinda de Cristo.]
          </p>
        </div>
      </section>
    </>
  );
}
