import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <span className="eyebrow">Erro 404</span>
      <h1 className="font-serif text-3xl sm:text-4xl mt-3 mb-4">Página não encontrada</h1>
      <p className="text-muted mb-8">A página que você procura não existe ou foi movida.</p>
      <Link to="/" className="btn-primary">
        Voltar para o início
      </Link>
    </div>
  );
}
