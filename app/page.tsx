import { authEnabled } from "../flags";
import GlideWeatherApp from "./components/GlideWeatherApp";

export default async function Home() {
  const authOn = await authEnabled();
  const mapboxAccessToken = process.env.MAPBOX_PERSONAL_ACCESS_TOKEN?.trim() ?? "";

  return <GlideWeatherApp authEnabled={authOn} mapboxAccessToken={mapboxAccessToken} />;
}
