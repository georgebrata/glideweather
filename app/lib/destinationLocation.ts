import { getDestinationById } from "../content/destinations";
import type { ContentLocale } from "../seo/types";
import type { LocationChoice } from "./weather";

export function destinationToLocationChoice(
  id: string,
  contentLocale: ContentLocale = "en",
): LocationChoice | null {
  const destination = getDestinationById(id);
  if (!destination) return null;
  return {
    id: destination.id,
    name: destination.names[contentLocale],
    detail: destination.areas[contentLocale],
    latitude: destination.latitude,
    longitude: destination.longitude,
    source: "search",
  };
}
