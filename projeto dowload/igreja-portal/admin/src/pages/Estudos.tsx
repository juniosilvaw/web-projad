import ResourceCrud from "../components/ResourceCrud";
import { estudosConfig } from "../resources/estudos";

export default function Estudos() {
  return <ResourceCrud config={estudosConfig} />;
}
