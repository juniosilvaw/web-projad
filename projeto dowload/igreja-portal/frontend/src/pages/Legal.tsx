import PageHeader from "../components/ui/PageHeader";

export function Privacidade() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Política de privacidade" />
      <div className="container-page py-16 max-w-prose text-muted">
        <p>
          [Texto a configurar: descreva aqui como os dados enviados pelos formulários do site
          (contato, pedido de oração) são coletados, usados e armazenados.]
        </p>
      </div>
    </>
  );
}

export function Termos() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Termos de uso" />
      <div className="container-page py-16 max-w-prose text-muted">
        <p>[Texto a configurar: descreva aqui os termos de uso do site.]</p>
      </div>
    </>
  );
}
