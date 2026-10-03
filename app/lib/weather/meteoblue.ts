import { z } from "zod";
import { DEFAULT_LOCALE, getTranslations, type AppLocale } from "../../i18n";
import {
  type CurrentSnapshot,
  type DayForecast,
  type LocationChoice,
  type WeatherSample,
  evaluateFlight,
} from "./domain";
import { WeatherProviderError } from "./errors";
import { pictocodeLabel } from "./pictocode";
import {
  astronomicalSunriseSunset,
  isDaylightAt,
} from "./sun";
import type { AirQualityCurrent } from "./openMeteo";

export const METEOBLUE_PACKAGES = "basic-1h,wind-3h,clouds-3h,air-3h";
const METEOBLUE_TIMEOUT_MS = 8_000;
const FORECAST_DAYS = 4;

const MeteoblueResponseSchema = z.object({
  metadata: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      height: z.number().optional(),
      timezone: z.string().optional(),
      timezone_abbreviation: z.string().optional(),
      timezone_offset_seconds: z.number().optional(),
      modelrun_utc: z.string().optional(),
      modelrun_updatetime_utc: z.string().optional(),
    })
    .passthrough(),
  units: z.record(z.string(), z.string()).optional(),
  data_1h: z
    .object({
      time: z.array(z.string()),
    })
    .passthrough()
    .optional(),
  data_3h: z
    .object({
      time: z.array(z.string()),
    })
    .passthrough()
    .optional(),
  data_day: z
    .object({
      time: z.array(z.string()),
    })
    .passthrough()
    .optional(),
});

export type MeteoblueNormalized = {
  timezone: string;
  elevation: number | null;
  modelRunUtc: string | null;
  hourEpochMs: number[];
  hours: WeatherSample[];
  daily: Record<
    string,
    {
      temperatureMax: number | null;
      temperatureMin: number | null;
      precipitationSum: number | null;
      precipitationProbabilityMax: number | null;
      windSpeedMax: number | null;
      windGustsMax: number | null;
      uvIndexMax: number | null;
      pictocode: number | null;
      predictabilityPercent: number | null;
    }
  >;
};

type SeriesBlock = Record<string, unknown> & { time?: string[] };

function seriesAt(
  block: SeriesBlock | undefined,
  keys: string[],
  index: number,
): number | null {
  if (!block) return null;
  for (const key of keys) {
    const value = block[key];
    if (Array.isArray(value)) {
      const entry = value[index];
      if (typeof entry === "number" && Number.isFinite(entry)) return entry;
      if (entry === null) return null;
    }
  }
  return null;
}

function parseTimestampMs(value: string): number {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const ms = Date.parse(normalized);
  return Number.isFinite(ms) ? ms : 0;
}

function toLocalIsoMinute(
  raw: string,
  timezone: string,
): string {
  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const date = new Date(normalized);
  if (!Number.isFinite(date.getTime())) {
    return raw.slice(0, 16);
  }
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function visibilityToMeters(
  value: number | null,
  units: Record<string, string> | undefined,
): number | null {
  if (value === null) return null;
  const unit = units?.visibility?.toLowerCase() ?? "";
  if (unit.includes("km")) return value * 1000;
  if (unit.includes("m")) return value;
  return value < 50 ? value * 1000 : value;
}

type GustMatch = {
  gust: number;
  origin: "exact" | "latest-within-3h";
  sourceTime: string;
};

function matchGust(
  hourMs: number,
  times3h: string[],
  gusts: (number | null)[],
): GustMatch | null {
  let best: GustMatch | null = null;
  let bestMs = -Infinity;

  times3h.forEach((time, index) => {
    const gust = gusts[index];
    if (gust === null || gust === undefined) return;
    const ms = parseTimestampMs(time);
    if (ms === hourMs) {
      best = { gust, origin: "exact", sourceTime: time };
      bestMs = ms;
      return;
    }
    if (ms <= hourMs && hourMs - ms <= 3 * 3_600_000 && ms > bestMs) {
      bestMs = ms;
      best = { gust, origin: "latest-within-3h", sourceTime: time };
    }
  });

  return best;
}

function match3hIndex(hourMs: number, times3h: string[]): number | null {
  let bestIndex: number | null = null;
  let bestMs = -Infinity;
  times3h.forEach((time, index) => {
    const ms = parseTimestampMs(time);
    if (ms <= hourMs && hourMs - ms <= 3 * 3_600_000 && ms >= bestMs) {
      bestMs = ms;
      bestIndex = index;
    }
  });
  return bestIndex;
}

export function buildMeteoblueUrl(latitude: number, longitude: number, apiKey: string) {
  const search = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
    apikey: apiKey,
    forecast_days: String(FORECAST_DAYS),
    windspeedunit: "kmh",
    temperatureunit: "Celsius",
    precipitationunit: "mm",
  });
  return `https://my.meteoblue.com/packages/${METEOBLUE_PACKAGES}?${search.toString()}`;
}

export function normalizeMeteoblueResponse(
  raw: z.infer<typeof MeteoblueResponseSchema>,
  location: LocationChoice,
  locale: AppLocale,
): MeteoblueNormalized {
  const data1h = raw.data_1h;
  if (!data1h?.time?.length) {
    throw new WeatherProviderError(
      "meteoblue",
      "invalid_response",
      "Meteoblue response missing data_1h time series",
    );
  }

  const timezone =
    raw.metadata.timezone ??
    location.timezone ??
    (raw.metadata.timezone_offset_seconds !== undefined
      ? `Etc/GMT${raw.metadata.timezone_offset_seconds >= 0 ? "-" : "+"}${Math.abs(raw.metadata.timezone_offset_seconds / 3600)}`
      : "UTC");

  const block1h = data1h as SeriesBlock;
  const block3h = (raw.data_3h ?? {}) as SeriesBlock;
  const times3h = block3h.time ?? [];
  const gustSeries = times3h.map((time, index) => ({
    time,
    gust: seriesAt(block3h, ["gust", "windgust", "windgusts_10m"], index),
  }));

  const hourEpochMs: number[] = [];
  const hours: WeatherSample[] = data1h.time.map((rawTime, index) => {
    hourEpochMs.push(parseTimestampMs(rawTime));
    const time = toLocalIsoMinute(rawTime, timezone);
    const hourMs = parseTimestampMs(rawTime);
    const idx3h = match3hIndex(hourMs, times3h);
    const gustMatch = matchGust(
      hourMs,
      times3h,
      gustSeries.map((entry) => entry.gust),
    );

    const pictocode = seriesAt(block1h, ["pictocode", "pictocode_detailed"], index);
    const precip = seriesAt(block1h, ["precipitation"], index);
    const snowFraction = seriesAt(block1h, ["snowfraction", "snow_fraction"], index);

    const sample: WeatherSample = {
      time,
      temperature: seriesAt(block1h, ["temperature"], index),
      apparentTemperature: seriesAt(block1h, ["felttemperature", "felt_temperature"], index),
      humidity: seriesAt(block1h, ["relativehumidity", "relative_humidity"], index),
      pressure:
        idx3h !== null
          ? seriesAt(block3h, ["surfaceairpressure", "surface_air_pressure"], idx3h)
          : null,
      precipitation: precip,
      precipitationProbability: seriesAt(
        block1h,
        ["precipitation_probability", "precipitationprobability"],
        index,
      ),
      weatherCode: null,
      weatherLabel: pictocodeLabel(pictocode, locale),
      cloudCover:
        idx3h !== null
          ? seriesAt(block3h, ["totalcloudcover", "cloudcover_total", "cloudcover"], idx3h)
          : null,
      visibility:
        idx3h !== null
          ? visibilityToMeters(
              seriesAt(block3h, ["visibility"], idx3h),
              raw.units,
            )
          : null,
      windSpeed: seriesAt(block1h, ["windspeed", "windspeed_10m", "wind_speed_10m"], index),
      windDirection: seriesAt(
        block1h,
        ["winddirection", "winddirection_10m", "wind_direction_10m"],
        index,
      ),
      windGusts: gustMatch?.gust ?? null,
      cape: idx3h !== null ? seriesAt(block3h, ["cape"], idx3h) : null,
      uvIndex: seriesAt(block1h, ["uvindex", "uv_index"], index),
      europeanAqi: null,
      usAqi: null,
      pm10: null,
      pm25: null,
      isDay: isDaylightAt(location.latitude, location.longitude, time, timezone),
      pictocode,
      seaLevelPressureHpa: seriesAt(
        block1h,
        ["sealevelpressure", "sea_level_pressure"],
        index,
      ),
      convectivePrecipitationMm: seriesAt(
        block1h,
        ["convective_precipitation", "convectiveprecipitation"],
        index,
      ),
      snowFraction,
      cloudCoverLow:
        idx3h !== null ? seriesAt(block3h, ["lowclouds", "cloudcover_low"], idx3h) : null,
      cloudCoverMid:
        idx3h !== null ? seriesAt(block3h, ["midclouds", "cloudcover_mid"], idx3h) : null,
      cloudCoverHigh:
        idx3h !== null ? seriesAt(block3h, ["highclouds", "cloudcover_high"], idx3h) : null,
      windSpeed80mKmh:
        idx3h !== null ? seriesAt(block3h, ["windspeed_80m"], idx3h) : null,
      windDirection80mDeg:
        idx3h !== null ? seriesAt(block3h, ["winddirection_80m"], idx3h) : null,
      windGustResolutionHours: gustMatch ? 3 : null,
      windGustOrigin: gustMatch?.origin ?? null,
      windGustSourceTime: gustMatch
        ? toLocalIsoMinute(gustMatch.sourceTime, timezone)
        : null,
      liftedIndex:
        idx3h !== null ? seriesAt(block3h, ["liftedindex", "lifted_index"], idx3h) : null,
      boundaryLayerHeightM:
        idx3h !== null ? seriesAt(block3h, ["pblheight", "boundarylayerheight"], idx3h) : null,
      convectiveInhibitionJkg:
        idx3h !== null
          ? seriesAt(block3h, ["convectiveinhibition", "convective_inhibition"], idx3h)
          : null,
      sunshineTimeMinutes:
        idx3h !== null ? seriesAt(block3h, ["sunshinetime", "sunshine_time"], idx3h) : null,
    };

    return sample;
  });

  const daily: MeteoblueNormalized["daily"] = {};
  const blockDay = (raw.data_day ?? {}) as SeriesBlock;
  const dayTimes = blockDay.time ?? [];

  dayTimes.forEach((dayTime, index) => {
    const date = toLocalIsoMinute(dayTime, timezone).slice(0, 10);
    daily[date] = {
      temperatureMax: seriesAt(blockDay, ["temperature_max", "temperaturemax"], index),
      temperatureMin: seriesAt(blockDay, ["temperature_min", "temperaturemin"], index),
      precipitationSum: seriesAt(blockDay, ["precipitation", "precipitation_sum"], index),
      precipitationProbabilityMax: seriesAt(
        blockDay,
        ["precipitation_probability", "precipitationprobability"],
        index,
      ),
      windSpeedMax: seriesAt(blockDay, ["windspeed_max", "windspeedmax"], index),
      windGustsMax: seriesAt(blockDay, ["gust_max", "gustmax"], index),
      uvIndexMax: seriesAt(blockDay, ["uvindex", "uv_index"], index),
      pictocode: seriesAt(blockDay, ["pictocode"], index),
      predictabilityPercent: seriesAt(blockDay, ["predictability"], index),
    };
  });

  for (const hour of hours) {
    const date = hour.time.slice(0, 10);
    if (!daily[date]) {
      daily[date] = {
        temperatureMax: null,
        temperatureMin: null,
        precipitationSum: null,
        precipitationProbabilityMax: null,
        windSpeedMax: null,
        windGustsMax: null,
        uvIndexMax: null,
        pictocode: null,
        predictabilityPercent: null,
      };
    }
    const row = daily[date];
    if (hour.temperature !== null) {
      row.temperatureMax =
        row.temperatureMax === null
          ? hour.temperature
          : Math.max(row.temperatureMax, hour.temperature);
      row.temperatureMin =
        row.temperatureMin === null
          ? hour.temperature
          : Math.min(row.temperatureMin, hour.temperature);
    }
    if (hour.windSpeed !== null) {
      row.windSpeedMax =
        row.windSpeedMax === null
          ? hour.windSpeed
          : Math.max(row.windSpeedMax, hour.windSpeed);
    }
    if (hour.windGusts !== null) {
      row.windGustsMax =
        row.windGustsMax === null
          ? hour.windGusts
          : Math.max(row.windGustsMax, hour.windGusts);
    }
    if (hour.precipitationProbability !== null) {
      row.precipitationProbabilityMax =
        row.precipitationProbabilityMax === null
          ? hour.precipitationProbability
          : Math.max(row.precipitationProbabilityMax, hour.precipitationProbability);
    }
    if (hour.uvIndex !== null) {
      row.uvIndexMax =
        row.uvIndexMax === null ? hour.uvIndex : Math.max(row.uvIndexMax, hour.uvIndex);
    }
    if (hour.precipitation !== null) {
      row.precipitationSum =
        (row.precipitationSum ?? 0) + hour.precipitation;
    }
  }

  return {
    timezone,
    elevation: raw.metadata.height ?? null,
    modelRunUtc: raw.metadata.modelrun_utc ?? null,
    hourEpochMs,
    hours,
    daily,
  };
}

function mergeAir(sample: WeatherSample, air: AirQualityCurrent): WeatherSample {
  return {
    ...sample,
    uvIndex: sample.uvIndex ?? air.uvIndex,
    europeanAqi: air.europeanAqi,
    usAqi: air.usAqi,
    pm10: air.pm10,
    pm25: air.pm25,
  };
}

function mergeAirHourly(samples: WeatherSample[], airHourly: Map<string, AirQualityCurrent>) {
  return samples.map((sample) => {
    const key = sample.time.slice(0, 13);
    const air = airHourly.get(key);
    return air ? mergeAir(sample, air) : sample;
  });
}

export function buildCurrentFromBundle(
  bundle: MeteoblueNormalized,
  location: LocationChoice,
  locale: AppLocale,
  air: AirQualityCurrent,
): CurrentSnapshot {
  const now = Date.now();
  let bestIndex = 0;
  let bestDelta = Infinity;
  bundle.hourEpochMs.forEach((ms, index) => {
    const delta = Math.abs(ms - now);
    if (delta < bestDelta) {
      bestDelta = delta;
      bestIndex = index;
    }
  });
  const best = bundle.hours[bestIndex] ?? bundle.hours[0];

  const sample = mergeAir(best, air);

  return {
    location,
    timezone: bundle.timezone,
    elevation: bundle.elevation,
    sample,
    verdict: evaluateFlight(sample, locale),
    sources: ["meteoblue Forecast", "Open-Meteo Air Quality"],
    provider: {
      id: "meteoblue",
      fallback: false,
      modelRunUtc: bundle.modelRunUtc,
    },
  };
}

export function buildDayFromBundle(
  bundle: MeteoblueNormalized,
  location: LocationChoice,
  date: string,
  locale: AppLocale,
  airByHour: Map<string, AirQualityCurrent>,
): DayForecast {
  const daySamples = mergeAirHourly(
    bundle.hours.filter((hour) => hour.time.startsWith(date)),
    airByHour,
  );

  const dailyRow = bundle.daily[date];
  const sun = astronomicalSunriseSunset(
    location.latitude,
    location.longitude,
    date,
    bundle.timezone,
  );

  const predictabilityPercent = dailyRow?.predictabilityPercent ?? null;
  const predictabilityCaution =
    predictabilityPercent !== null && predictabilityPercent < 30
      ? "low"
      : null;

  const ranked = daySamples
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

  const pictocode = dailyRow?.pictocode ?? best.sample?.pictocode ?? null;

  return {
    date,
    location,
    timezone: bundle.timezone,
    daily: {
      weatherCode: null,
      weatherLabel: pictocodeLabel(pictocode, locale),
      temperatureMax: dailyRow?.temperatureMax ?? null,
      temperatureMin: dailyRow?.temperatureMin ?? null,
      precipitationSum: dailyRow?.precipitationSum ?? null,
      precipitationProbabilityMax: dailyRow?.precipitationProbabilityMax ?? null,
      windSpeedMax: dailyRow?.windSpeedMax ?? null,
      windGustsMax: dailyRow?.windGustsMax ?? null,
      uvIndexMax: dailyRow?.uvIndexMax ?? null,
      sunrise: sun?.sunrise ?? null,
      sunset: sun?.sunset ?? null,
      predictabilityPercent,
      sunriseCalculated: Boolean(sun),
      sunsetCalculated: Boolean(sun),
      predictabilityCaution,
    },
    samples: daySamples,
    best,
    topWindows: ranked
      .filter((entry) => entry.verdict.status !== "no-go")
      .slice(0, 4),
    sources: ["meteoblue Forecast", "Open-Meteo Air Quality"],
    provider: {
      id: "meteoblue",
      fallback: false,
      modelRunUtc: bundle.modelRunUtc,
    },
  };
}

export async function fetchMeteoblueBundle(
  location: LocationChoice,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<MeteoblueNormalized> {
  const apiKey = process.env.METEOBLUE_API_KEY?.trim();
  if (!apiKey) {
    throw new WeatherProviderError(
      "meteoblue",
      "configuration",
      "METEOBLUE_API_KEY is not configured",
      { retryable: true },
    );
  }

  if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
    throw new WeatherProviderError(
      "meteoblue",
      "invalid_response",
      "Invalid coordinates for Meteoblue request",
    );
  }

  const url = buildMeteoblueUrl(location.latitude, location.longitude, apiKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), METEOBLUE_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (response.status === 401 || response.status === 403) {
      throw new WeatherProviderError(
        "meteoblue",
        "authentication",
        `Meteoblue authentication failed (${response.status})`,
        { status: response.status },
      );
    }
    if (response.status === 429) {
      throw new WeatherProviderError(
        "meteoblue",
        "rate_limit",
        "Meteoblue rate limit exceeded",
        { status: response.status },
      );
    }
    if (!response.ok) {
      throw new WeatherProviderError(
        "meteoblue",
        "http",
        `Meteoblue HTTP ${response.status}`,
        { status: response.status },
      );
    }

    const json = await response.json();
    const parsed = MeteoblueResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new WeatherProviderError(
        "meteoblue",
        "invalid_response",
        "Meteoblue response failed schema validation",
        { cause: parsed.error },
      );
    }

    return normalizeMeteoblueResponse(parsed.data, location, locale);
  } catch (error) {
    if (error instanceof WeatherProviderError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new WeatherProviderError("meteoblue", "timeout", "Meteoblue request timed out");
    }
    throw new WeatherProviderError("meteoblue", "network", "Meteoblue network error", {
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}
