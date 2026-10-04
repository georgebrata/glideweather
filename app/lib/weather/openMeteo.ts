import { z } from "zod";
import {
  DEFAULT_LOCALE,
  getOpenMeteoLanguage,
  getTranslations,
  type AppLocale,
} from "../../i18n";
import {
  type CurrentSnapshot,
  type DayForecast,
  type LocationChoice,
  type WeatherProviderInfo,
  type WeatherSample,
  evaluateFlight,
  weatherCodeLabel,
} from "./domain";
import type { WeatherErrorCode } from "./errors";

const nullableNumber = z.number().nullable();

const CurrentForecastSchema = z.object({
  timezone: z.string(),
  elevation: z.number().nullable().optional(),
  current: z.object({
    time: z.string(),
    temperature_2m: nullableNumber,
    relative_humidity_2m: nullableNumber,
    apparent_temperature: nullableNumber,
    is_day: nullableNumber,
    precipitation: nullableNumber,
    rain: nullableNumber,
    showers: nullableNumber,
    snowfall: nullableNumber,
    weather_code: nullableNumber,
    cloud_cover: nullableNumber,
    surface_pressure: nullableNumber,
    visibility: nullableNumber,
    wind_speed_10m: nullableNumber,
    wind_direction_10m: nullableNumber,
    wind_gusts_10m: nullableNumber,
    cape: nullableNumber,
  }),
});

const CurrentAirSchema = z.object({
  current: z.object({
    european_aqi: nullableNumber,
    us_aqi: nullableNumber,
    pm10: nullableNumber,
    pm2_5: nullableNumber,
    uv_index: nullableNumber,
  }),
});

const ForecastDaySchema = z.object({
  timezone: z.string(),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(nullableNumber),
    temperature_2m_max: z.array(nullableNumber),
    temperature_2m_min: z.array(nullableNumber),
    precipitation_sum: z.array(nullableNumber),
    precipitation_probability_max: z.array(nullableNumber),
    wind_speed_10m_max: z.array(nullableNumber),
    wind_gusts_10m_max: z.array(nullableNumber),
    uv_index_max: z.array(nullableNumber),
    sunrise: z.array(z.string().nullable()),
    sunset: z.array(z.string().nullable()),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(nullableNumber),
    relative_humidity_2m: z.array(nullableNumber),
    apparent_temperature: z.array(nullableNumber),
    precipitation_probability: z.array(nullableNumber),
    precipitation: z.array(nullableNumber),
    weather_code: z.array(nullableNumber),
    cloud_cover: z.array(nullableNumber),
    visibility: z.array(nullableNumber),
    surface_pressure: z.array(nullableNumber),
    wind_speed_10m: z.array(nullableNumber),
    wind_direction_10m: z.array(nullableNumber),
    wind_gusts_10m: z.array(nullableNumber),
    cape: z.array(nullableNumber),
    is_day: z.array(nullableNumber),
  }),
});

const AirDaySchema = z.object({
  hourly: z.object({
    time: z.array(z.string()),
    european_aqi: z.array(nullableNumber),
    us_aqi: z.array(nullableNumber),
    pm10: z.array(nullableNumber),
    pm2_5: z.array(nullableNumber),
    uv_index: z.array(nullableNumber),
  }),
});

export const GeocodingSchema = z.object({
  results: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        country: z.string().optional(),
        admin1: z.string().optional(),
        timezone: z.string().optional(),
      }),
    )
    .optional(),
});

async function requestJson<T>(
  url: string,
  schema: z.ZodSchema<T>,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(getTranslations(locale).errors.weatherServiceStatus(response.status));
  }

  return schema.parse(await response.json());
}

function forecastUrl(location: LocationChoice, params: Record<string, string>) {
  const search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "auto",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
    ...params,
  });

  return `https://api.open-meteo.com/v1/forecast?${search.toString()}`;
}

function airUrl(location: LocationChoice, params: Record<string, string>) {
  const search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "auto",
    ...params,
  });

  return `https://air-quality-api.open-meteo.com/v1/air-quality?${search.toString()}`;
}

export async function searchLocationsOpenMeteo(
  query: string,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<LocationChoice[]> {
  const trimmed = query.trim();

  if (trimmed.length < 3) {
    return [];
  }

  const search = new URLSearchParams({
    name: trimmed,
    count: "6",
    language: getOpenMeteoLanguage(locale),
    format: "json",
  });
  const data = await requestJson(
    `https://geocoding-api.open-meteo.com/v1/search?${search.toString()}`,
    GeocodingSchema,
    locale,
  );

  return (data.results ?? []).map((place) => ({
    id: String(place.id),
    name: place.name,
    detail: [place.admin1, place.country].filter(Boolean).join(", "),
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone,
    source: "search",
  }));
}

export type AirQualityCurrent = {
  uvIndex: number | null;
  europeanAqi: number | null;
  usAqi: number | null;
  pm10: number | null;
  pm25: number | null;
};

export async function fetchOpenMeteoAirCurrent(
  location: LocationChoice,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<AirQualityCurrent> {
  try {
    const air = await requestJson(
      airUrl(location, {
        current: "european_aqi,us_aqi,pm10,pm2_5,uv_index",
      }),
      CurrentAirSchema,
      locale,
    );
    return {
      uvIndex: air.current.uv_index,
      europeanAqi: air.current.european_aqi,
      usAqi: air.current.us_aqi,
      pm10: air.current.pm10,
      pm25: air.current.pm2_5,
    };
  } catch {
    return {
      uvIndex: null,
      europeanAqi: null,
      usAqi: null,
      pm10: null,
      pm25: null,
    };
  }
}

export async function fetchOpenMeteoAirHourlyMap(
  location: LocationChoice,
  date: string,
  locale: AppLocale,
): Promise<Map<string, AirQualityCurrent>> {
  const air = await fetchOpenMeteoAirDay(location, date, locale);
  const map = new Map<string, AirQualityCurrent>();
  if (!air) return map;
  air.hourly.time.forEach((time, index) => {
    map.set(time.slice(0, 13), {
      uvIndex: air.hourly.uv_index[index] ?? null,
      europeanAqi: air.hourly.european_aqi[index] ?? null,
      usAqi: air.hourly.us_aqi[index] ?? null,
      pm10: air.hourly.pm10[index] ?? null,
      pm25: air.hourly.pm2_5[index] ?? null,
    });
  });
  return map;
}

async function fetchOpenMeteoAirDay(
  location: LocationChoice,
  date: string,
  locale: AppLocale,
) {
  try {
    return await requestJson(
      airUrl(location, {
        start_date: date,
        end_date: date,
        hourly: "european_aqi,us_aqi,pm10,pm2_5,uv_index",
      }),
      AirDaySchema,
      locale,
    );
  } catch {
    return null;
  }
}

function openMeteoProviderInfo(
  fallback: boolean,
  fallbackReason?: WeatherErrorCode,
): WeatherProviderInfo {
  return {
    id: "open-meteo",
    fallback,
    fallbackReason,
  };
}

export async function fetchOpenMeteoCurrentSnapshot(
  location: LocationChoice,
  locale: AppLocale = DEFAULT_LOCALE,
  options?: { fallback?: boolean; fallbackReason?: WeatherErrorCode },
): Promise<CurrentSnapshot> {
  const fallback = options?.fallback ?? false;
  const [forecast, air] = await Promise.all([
    requestJson(
      forecastUrl(location, {
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "is_day",
          "precipitation",
          "rain",
          "showers",
          "snowfall",
          "weather_code",
          "cloud_cover",
          "surface_pressure",
          "visibility",
          "wind_speed_10m",
          "wind_direction_10m",
          "wind_gusts_10m",
          "cape",
        ].join(","),
      }),
      CurrentForecastSchema,
      locale,
    ),
    fetchOpenMeteoAirCurrent(location, locale),
  ]);

  const sample: WeatherSample = {
    time: forecast.current.time,
    temperature: forecast.current.temperature_2m,
    apparentTemperature: forecast.current.apparent_temperature,
    humidity: forecast.current.relative_humidity_2m,
    pressure: forecast.current.surface_pressure,
    precipitation:
      (forecast.current.precipitation ?? 0) +
      (forecast.current.rain ?? 0) +
      (forecast.current.showers ?? 0) +
      (forecast.current.snowfall ?? 0),
    precipitationProbability: null,
    weatherCode: forecast.current.weather_code,
    weatherLabel: weatherCodeLabel(forecast.current.weather_code, locale),
    cloudCover: forecast.current.cloud_cover,
    visibility: forecast.current.visibility,
    windSpeed: forecast.current.wind_speed_10m,
    windDirection: forecast.current.wind_direction_10m,
    windGusts: forecast.current.wind_gusts_10m,
    cape: forecast.current.cape,
    uvIndex: air.uvIndex,
    europeanAqi: air.europeanAqi,
    usAqi: air.usAqi,
    pm10: air.pm10,
    pm25: air.pm25,
    isDay:
      forecast.current.is_day === null ? null : forecast.current.is_day === 1,
    windGustResolutionHours: 1,
    windGustOrigin: "exact",
  };

  const provider = openMeteoProviderInfo(fallback, options?.fallbackReason);

  return {
    location,
    timezone: forecast.timezone,
    elevation: forecast.elevation ?? null,
    sample,
    verdict: evaluateFlight(sample, locale),
    sources: [
      "Open-Meteo Forecast",
      "Open-Meteo Air Quality",
      location.source === "gps" ? "Browser GPS" : "Open-Meteo Geocoding",
    ],
    provider,
  };
}

export async function fetchOpenMeteoDayForecast(
  location: LocationChoice,
  date: string,
  locale: AppLocale = DEFAULT_LOCALE,
  options?: { fallback?: boolean; fallbackReason?: WeatherErrorCode },
): Promise<DayForecast> {
  const fallback = options?.fallback ?? false;
  const [forecast, air] = await Promise.all([
    requestJson(
      forecastUrl(location, {
        start_date: date,
        end_date: date,
        hourly: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "precipitation_probability",
          "precipitation",
          "weather_code",
          "cloud_cover",
          "visibility",
          "surface_pressure",
          "wind_speed_10m",
          "wind_direction_10m",
          "wind_gusts_10m",
          "cape",
          "is_day",
        ].join(","),
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum",
          "precipitation_probability_max",
          "wind_speed_10m_max",
          "wind_gusts_10m_max",
          "uv_index_max",
          "sunrise",
          "sunset",
        ].join(","),
      }),
      ForecastDaySchema,
      locale,
    ),
    fetchOpenMeteoAirDay(location, date, locale),
  ]);

  const airByTime = new Map<string, number>();
  air?.hourly.time.forEach((time, index) => airByTime.set(time, index));

  const samples = forecast.hourly.time.map((time, index) => {
    const airIndex = airByTime.get(time);

    return {
      time,
      temperature: forecast.hourly.temperature_2m[index] ?? null,
      apparentTemperature: forecast.hourly.apparent_temperature[index] ?? null,
      humidity: forecast.hourly.relative_humidity_2m[index] ?? null,
      pressure: forecast.hourly.surface_pressure[index] ?? null,
      precipitation: forecast.hourly.precipitation[index] ?? null,
      precipitationProbability:
        forecast.hourly.precipitation_probability[index] ?? null,
      weatherCode: forecast.hourly.weather_code[index] ?? null,
      weatherLabel: weatherCodeLabel(forecast.hourly.weather_code[index], locale),
      cloudCover: forecast.hourly.cloud_cover[index] ?? null,
      visibility: forecast.hourly.visibility[index] ?? null,
      windSpeed: forecast.hourly.wind_speed_10m[index] ?? null,
      windDirection: forecast.hourly.wind_direction_10m[index] ?? null,
      windGusts: forecast.hourly.wind_gusts_10m[index] ?? null,
      cape: forecast.hourly.cape[index] ?? null,
      uvIndex:
        airIndex === undefined ? null : air?.hourly.uv_index[airIndex] ?? null,
      europeanAqi:
        airIndex === undefined ? null : air?.hourly.european_aqi[airIndex] ?? null,
      usAqi:
        airIndex === undefined ? null : air?.hourly.us_aqi[airIndex] ?? null,
      pm10: airIndex === undefined ? null : air?.hourly.pm10[airIndex] ?? null,
      pm25: airIndex === undefined ? null : air?.hourly.pm2_5[airIndex] ?? null,
      isDay:
        forecast.hourly.is_day[index] === null
          ? null
          : forecast.hourly.is_day[index] === 1,
      windGustResolutionHours: 1,
      windGustOrigin: "exact",
    } satisfies WeatherSample;
  });

  const ranked = samples
    .filter((sample) => sample.isDay !== false)
    .map((sample) => ({ sample, verdict: evaluateFlight(sample, locale) }))
    .sort((a, b) => b.verdict.score - a.verdict.score);
  const best = ranked[0] ?? {
    sample: null,
    verdict: {
      status: "no-go" as const,
      title: getTranslations(locale).weather.titles.noLight,
      score: 0,
      reasons: [getTranslations(locale).weather.reasons.noLightForecast],
      cautions: [],
    },
  };

  const provider = openMeteoProviderInfo(fallback, options?.fallbackReason);

  return {
    date,
    location,
    timezone: forecast.timezone,
    daily: {
      weatherCode: forecast.daily.weather_code[0] ?? null,
      weatherLabel: weatherCodeLabel(forecast.daily.weather_code[0], locale),
      temperatureMax: forecast.daily.temperature_2m_max[0] ?? null,
      temperatureMin: forecast.daily.temperature_2m_min[0] ?? null,
      precipitationSum: forecast.daily.precipitation_sum[0] ?? null,
      precipitationProbabilityMax:
        forecast.daily.precipitation_probability_max[0] ?? null,
      windSpeedMax: forecast.daily.wind_speed_10m_max[0] ?? null,
      windGustsMax: forecast.daily.wind_gusts_10m_max[0] ?? null,
      uvIndexMax: forecast.daily.uv_index_max[0] ?? null,
      sunrise: forecast.daily.sunrise[0] ?? null,
      sunset: forecast.daily.sunset[0] ?? null,
    },
    samples,
    best,
    topWindows: ranked
      .filter((entry) => entry.verdict.status !== "no-go")
      .slice(0, 4),
    sources: ["Open-Meteo Forecast", "Open-Meteo Air Quality"],
    provider,
  };
}
