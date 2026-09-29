import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiPost } from "../lib/api";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: string;
}

interface LoginResposta {
  token: string;
  usuario: Usuario;
}

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "igreja_admin_token";
const USER_KEY = "igreja_admin_usuario";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvo = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (salvo && token) {
      setUsuario(JSON.parse(salvo));
    }
    setCarregando(false);
  }, []);

  async function entrar(email: string, senha: string) {
    const resposta = await apiPost<LoginResposta>("/auth/login", { email, senha });
    localStorage.setItem(TOKEN_KEY, resposta.token);
    localStorage.setItem(USER_KEY, JSON.stringify(resposta.usuario));
    setUsuario(resposta.usuario);
  }

  function sair() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
