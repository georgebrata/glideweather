import { getDestinationById, localizedText } from "../content/destinations";
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
    name: localizedText(destination.names, contentLocale),
    detail: localizedText(destination.areas, contentLocale),
    latitude: destination.latitude,
    longitude: destination.longitude,
    source: "search",
  };
}
