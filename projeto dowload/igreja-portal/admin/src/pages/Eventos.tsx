import ResourceCrud from "../components/ResourceCrud";
import { eventosConfig } from "../resources/eventos";

export default function Eventos() {
  return <ResourceCrud config={eventosConfig} />;
}
