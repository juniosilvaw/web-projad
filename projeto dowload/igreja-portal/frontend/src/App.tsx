import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteDataProvider } from "./context/SiteDataContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import AIgreja from "./pages/AIgreja";
import Lideranca from "./pages/Lideranca";
import Ministerios from "./pages/Ministerios";
import Congregacoes from "./pages/Congregacoes";
import Eventos from "./pages/Eventos";
import EventoDetalhe from "./pages/EventoDetalhe";
import Noticias from "./pages/Noticias";
import NoticiaDetalhe from "./pages/NoticiaDetalhe";
import Midia from "./pages/Midia";
import Estudos from "./pages/Estudos";
import Contato from "./pages/Contato";
import Contribua from "./pages/Contribua";
import PedidoOracao from "./pages/PedidoOracao";
import NotFound from "./pages/NotFound";
import { Privacidade, Termos } from "./pages/Legal";

export default function App() {
  return (
    <SiteDataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/a-igreja" element={<AIgreja />} />
            <Route path="/lideranca" element={<Lideranca />} />
            <Route path="/ministerios" element={<Ministerios />} />
            <Route path="/congregacoes" element={<Congregacoes />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<EventoDetalhe />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:id" element={<NoticiaDetalhe />} />
            <Route path="/midia" element={<Midia />} />
            <Route path="/estudos" element={<Estudos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/contribua" element={<Contribua />} />
            <Route path="/pedido-de-oracao" element={<PedidoOracao />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SiteDataProvider>
  );
}
