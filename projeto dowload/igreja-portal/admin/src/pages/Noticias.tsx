import ResourceCrud from "../components/ResourceCrud";
import { noticiasConfig } from "../resources/noticias";

export default function Noticias() {
  return <ResourceCrud config={noticiasConfig} />;
}
