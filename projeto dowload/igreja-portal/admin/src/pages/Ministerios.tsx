import ResourceCrud from "../components/ResourceCrud";
import { ministeriosConfig } from "../resources/ministerios";

export default function Ministerios() {
  return <ResourceCrud config={ministeriosConfig} />;
}
