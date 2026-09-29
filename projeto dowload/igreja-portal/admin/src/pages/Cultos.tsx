import ResourceCrud from "../components/ResourceCrud";
import { cultosConfig } from "../resources/cultos";

export default function Cultos() {
  return <ResourceCrud config={cultosConfig} />;
}
