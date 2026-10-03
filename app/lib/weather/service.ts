import { DEFAULT_LOCALE, type AppLocale } from "../../i18n";
import type { CurrentSnapshot, DayForecast, LocationChoice } from "./domain";
import { WeatherProviderError, logWeatherRequest } from "./errors";
import {
  buildCurrentFromBundle,
  buildDayFromBundle,
  fetchMeteoblueBundle,
  type MeteoblueNormalized,
} from "./meteoblue";
import {
  fetchOpenMeteoAirCurrent,
  fetchOpenMeteoAirHourlyMap,
  fetchOpenMeteoCurrentSnapshot,
  fetchOpenMeteoDayForecast,
} from "./openMeteo";

const CACHE_TTL_MS = 20 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  bundle: MeteoblueNormalized;
};

const meteoblueCache = new Map<string, CacheEntry>();

function cacheKey(location: LocationChoice) {
  const lat = Math.round(location.latitude * 1000) / 1000;
  const lon = Math.round(location.longitude * 1000) / 1000;
  return `${lat}:${lon}`;
}

async function getMeteoblueBundle(
  location: LocationChoice,
  locale: AppLocale,
): Promise<MeteoblueNormalized> {
  const key = cacheKey(location);
  const cached = meteoblueCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.bundle;
  }

  const bundle = await fetchMeteoblueBundle(location, locale);
  meteoblueCache.set(key, {
    bundle,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  return bundle;
}

export function clearMeteoblueCacheForTests() {
  meteoblueCache.clear();
}

export async function getCurrentSnapshot(
  location: LocationChoice,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<CurrentSnapshot> {
  const started = Date.now();
  try {
    const bundle = await getMeteoblueBundle(location, locale);
    const air = await fetchOpenMeteoAirCurrent(location, locale);
    const snapshot = buildCurrentFromBundle(bundle, location, locale, air);
    logWeatherRequest({
      provider: "meteoblue",
      fallback: false,
      durationMs: Date.now() - started,
      latitude: location.latitude,
      longitude: location.longitude,
      kind: "current",
    });
    return snapshot;
  } catch (error) {
    const reason =
      error instanceof WeatherProviderError ? error.code : "invalid_response";
    const snapshot = await fetchOpenMeteoCurrentSnapshot(location, locale, {
      fallback: true,
      fallbackReason: reason,
    });
    logWeatherRequest({
      provider: "open-meteo",
      fallback: true,
      fallbackReason: reason,
      durationMs: Date.now() - started,
      latitude: location.latitude,
      longitude: location.longitude,
      kind: "current",
    });
    return snapshot;
  }
}

export async function getDayForecast(
  location: LocationChoice,
  date: string,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<DayForecast> {
  const started = Date.now();
  try {
    const bundle = await getMeteoblueBundle(location, locale);
    const airByHour = await fetchOpenMeteoAirHourlyMap(location, date, locale);

    const forecast = buildDayFromBundle(bundle, location, date, locale, airByHour);
    logWeatherRequest({
      provider: "meteoblue",
      fallback: false,
      durationMs: Date.now() - started,
      latitude: location.latitude,
      longitude: location.longitude,
      kind: "day",
    });
    return forecast;
  } catch (error) {
    const reason =
      error instanceof WeatherProviderError ? error.code : "invalid_response";
    const forecast = await fetchOpenMeteoDayForecast(location, date, locale, {
      fallback: true,
      fallbackReason: reason,
    });
    logWeatherRequest({
      provider: "open-meteo",
      fallback: true,
      fallbackReason: reason,
      durationMs: Date.now() - started,
      latitude: location.latitude,
      longitude: location.longitude,
      kind: "day",
    });
    return forecast;
  }
}
