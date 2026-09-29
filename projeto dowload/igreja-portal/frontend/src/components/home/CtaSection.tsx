import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="bg-accent-soft/40">
      <div className="container-page py-16 sm:py-20 grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl sm:text-3xl">Precisa de oração?</h2>
          <p className="text-muted max-w-sm">
            Compartilhe seu pedido com nossa equipe de intercessão. Estamos aqui para orar com você.
          </p>
          <Link to="/pedido-de-oracao" className="btn-primary self-start mt-2">
            Enviar pedido de oração
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl sm:text-3xl">Quer conhecer um ministério?</h2>
          <p className="text-muted max-w-sm">
            Do louvor à ação social, há um espaço para você servir e crescer em comunhão.
          </p>
          <Link to="/ministerios" className="btn-ghost self-start mt-2">
            Conhecer os ministérios
          </Link>
        </div>
      </div>
    </section>
  );
}
