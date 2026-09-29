import ResourceCrud from "../components/ResourceCrud";
import { bannersConfig } from "../resources/banners";

export default function Banners() {
  return <ResourceCrud config={bannersConfig} />;
}
