import { z } from "zod";
import { DEFAULT_LOCALE, getOpenMeteoLanguage, type AppLocale } from "../i18n";
import type { LocationChoice } from "./weather";

const ReverseGeocodeSchema = z.object({
  results: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        country: z.string().optional(),
        admin1: z.string().optional(),
      }),
    )
    .optional(),
});

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<LocationChoice | null> {
  const search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    language: getOpenMeteoLanguage(locale),
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/reverse?${search.toString()}`,
  );

  if (!response.ok) return null;

  const data = ReverseGeocodeSchema.parse(await response.json());
  const place = data.results?.[0];
  if (!place) return null;

  return {
    id: `rev-${place.id}-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
    name: place.name,
    detail: [place.admin1, place.country].filter(Boolean).join(", "),
    latitude: place.latitude,
    longitude: place.longitude,
    source: "search",
  };
}

export function locationFromCoordinates(
  latitude: number,
  longitude: number,
  locale: AppLocale,
): LocationChoice {
  return {
    id: `pin-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
    name: new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(latitude) +
      ", " +
      new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(longitude),
    detail: "",
    latitude,
    longitude,
    source: "gps",
  };
}

export function formatCoordinateOverlay(latitude: number, longitude: number) {
  const latDir = latitude >= 0 ? "N" : "S";
  const lonDir = longitude >= 0 ? "E" : "W";
  const lat = `${Math.abs(latitude).toFixed(3)}° ${latDir}`;
  const lon = `${Math.abs(longitude).toFixed(3)}° ${lonDir}`;
  return `${lat} · ${lon}`;
}
