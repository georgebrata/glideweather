import {
  DEFAULT_LOCALE,
  type AppLocale,
} from "../i18n";
import type { CurrentSnapshot, DayForecast, LocationChoice } from "./weather/domain";

export type {
  CurrentSnapshot,
  DayForecast,
  FlightStatus,
  FlightVerdict,
  LocationChoice,
  WeatherProviderInfo,
  WeatherSample,
  WindGustOrigin,
} from "./weather/domain";

export {
  dateForOffset,
  evaluateFlight,
  formatDateLabel,
  formatTime,
  numberLabel,
  percentLabel,
  providerDisplayName,
  statusColor,
  weatherCodeLabel,
  windDirectionLabel,
} from "./weather/domain";

export { searchLocationsOpenMeteo } from "./weather/openMeteo";

async function weatherApi<T>(
  location: LocationChoice,
  params: Record<string, string>,
  locale: AppLocale,
): Promise<T> {
  const search = new URLSearchParams({
    lat: String(location.latitude),
    lon: String(location.longitude),
    id: location.id,
    name: location.name,
    source: location.source,
    locale,
    ...params,
  });
  if (location.detail) search.set("detail", location.detail);
  if (location.timezone) search.set("timezone", location.timezone);

  const response = await fetch(`/api/weather?${search.toString()}`);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Weather service error (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function searchLocations(
  query: string,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<LocationChoice[]> {
  const { searchLocationsOpenMeteo } = await import("./weather/openMeteo");
  return searchLocationsOpenMeteo(query, locale);
}

export async function fetchCurrentSnapshot(
  location: LocationChoice,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<CurrentSnapshot> {
  return weatherApi<CurrentSnapshot>(location, { kind: "current" }, locale);
}

export async function fetchDayForecast(
  location: LocationChoice,
  date: string,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<DayForecast> {
  return weatherApi<DayForecast>(
    location,
    { kind: "day", date },
    locale,
  );
}
