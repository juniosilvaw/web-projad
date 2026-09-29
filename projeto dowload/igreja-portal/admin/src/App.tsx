import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Noticias from "./pages/Noticias";
import Eventos from "./pages/Eventos";
import Cultos from "./pages/Cultos";
import Lideranca from "./pages/Lideranca";
import Ministerios from "./pages/Ministerios";
import Congregacoes from "./pages/Congregacoes";
import Estudos from "./pages/Estudos";
import Midias from "./pages/Midias";
import Banners from "./pages/Banners";
import PedidosOracao from "./pages/PedidosOracao";
import Mensagens from "./pages/Mensagens";
import Configuracoes from "./pages/Configuracoes";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/entrar" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/cultos" element={<Cultos />} />
            <Route path="/lideranca" element={<Lideranca />} />
            <Route path="/ministerios" element={<Ministerios />} />
            <Route path="/congregacoes" element={<Congregacoes />} />
            <Route path="/estudos" element={<Estudos />} />
            <Route path="/midias" element={<Midias />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/pedidos-oracao" element={<PedidosOracao />} />
            <Route path="/mensagens" element={<Mensagens />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
