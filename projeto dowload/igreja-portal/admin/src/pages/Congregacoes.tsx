import ResourceCrud from "../components/ResourceCrud";
import { congregacoesConfig } from "../resources/congregacoes";

export default function Congregacoes() {
  return <ResourceCrud config={congregacoesConfig} />;
}
