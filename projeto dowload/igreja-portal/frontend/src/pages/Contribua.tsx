import PageHeader from "../components/ui/PageHeader";
import { useSiteData } from "../context/SiteDataContext";

export default function Contribua() {
  const { config } = useSiteData();

  return (
    <>
      <PageHeader
        eyebrow="Generosidade"
        title="Contribua com a obra de Deus"
        description="Sua contribuição sustenta o trabalho da igreja e alcança vidas. Agradecemos sua generosidade."
      />

      <div className="container-page py-16 grid gap-8 sm:grid-cols-2">
        <div className="border border-line rounded-sm p-6 bg-white">
          <h2 className="font-serif text-xl mb-3">PIX</h2>
          <p className="text-sm text-muted mb-4">
            Contribua de forma rápida e segura usando a chave PIX abaixo.
          </p>
          <dl className="text-sm flex flex-col gap-2">
            <div>
              <dt className="font-medium text-ink">Chave PIX</dt>
              <dd className="text-muted">{config.pix_chave}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Favorecido</dt>
              <dd className="text-muted">{config.pix_favorecido}</dd>
            </div>
          </dl>
        </div>

        <div className="border border-line rounded-sm p-6 bg-white">
          <h2 className="font-serif text-xl mb-3">Outras formas</h2>
          <p className="text-sm text-muted">
            Para transferência bancária ou outras formas de contribuição, entre em contato
            conosco pelo telefone {config.telefone} ou e-mail {config.email}.
          </p>
        </div>
      </div>

      <div className="container-page pb-16">
        <div className="border border-line rounded-sm p-6 bg-accent-soft/30 text-sm text-muted max-w-prose">
          "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus
          ama quem dá com alegria." — 2 Coríntios 9:7
        </div>
      </div>
    </>
  );
}
