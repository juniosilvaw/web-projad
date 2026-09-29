import ResourceCrud from "../components/ResourceCrud";
import { midiasConfig } from "../resources/midias";

export default function Midias() {
  return <ResourceCrud config={midiasConfig} />;
}
