import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGet } from "../lib/api";
import { configPadrao } from "../config/site";
import type { Culto } from "../types";

interface SiteDataValue {
  config: Record<string, string>;
  cultos: Culto[];
  carregando: boolean;
  offline: boolean;
}

const SiteDataContext = createContext<SiteDataValue>({
  config: configPadrao,
  cultos: [],
  carregando: true,
  offline: false,
});

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Record<string, string>>(configPadrao);
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    Promise.all([
      apiGet<Record<string, string>>("/configuracoes"),
      apiGet<Culto[]>("/cultos"),
    ])
      .then(([configApi, cultosApi]) => {
        setConfig({ ...configPadrao, ...configApi });
        setCultos(cultosApi);
      })
      .catch(() => {
        setOffline(true);
      })
      .finally(() => setCarregando(false));
  }, []);

  return (
    <SiteDataContext.Provider value={{ config, cultos, carregando, offline }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
