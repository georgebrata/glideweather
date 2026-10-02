import { authEnabled } from "../flags";
import GlideWeatherApp from "./components/GlideWeatherApp";

export default async function Home() {
  const authOn = await authEnabled();

  return <GlideWeatherApp authEnabled={authOn} />;
}
