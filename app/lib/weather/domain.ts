import {
  DEFAULT_LOCALE,
  getIntlLocale,
  getTranslations,
  type AppLocale,
} from "../../i18n";
import type { WeatherErrorCode, WeatherProviderId } from "./errors";

export type LocationChoice = {
  id: string;
  name: string;
  detail?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  source: "gps" | "search" | "fallback";
};

export type FlightStatus = "good" | "marginal" | "no-go";

export type FlightVerdict = {
  status: FlightStatus;
  title: string;
  score: number;
  reasons: string[];
  cautions: string[];
};

export type WindGustOrigin = "exact" | "latest-within-3h";

export type WeatherProviderInfo = {
  id: WeatherProviderId;
  fallback: boolean;
  fallbackReason?: WeatherErrorCode;
  modelRunUtc?: string | null;
};

export type WeatherSample = {
  time: string;
  temperature: number | null;
  apparentTemperature: number | null;
  humidity: number | null;
  pressure: number | null;
  precipitation: number | null;
  precipitationProbability: number | null;
  weatherCode: number | null;
  weatherLabel: string;
  cloudCover: number | null;
  visibility: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  windGusts: number | null;
  cape: number | null;
  uvIndex: number | null;
  europeanAqi: number | null;
  usAqi: number | null;
  pm10: number | null;
  pm25: number | null;
  isDay: boolean | null;
  pictocode?: number | null;
  seaLevelPressureHpa?: number | null;
  convectivePrecipitationMm?: number | null;
  snowFraction?: number | null;
  cloudCoverLow?: number | null;
  cloudCoverMid?: number | null;
  cloudCoverHigh?: number | null;
  windSpeed80mKmh?: number | null;
  windDirection80mDeg?: number | null;
  windGustResolutionHours?: 1 | 3 | null;
  windGustOrigin?: WindGustOrigin | null;
  windGustSourceTime?: string | null;
  liftedIndex?: number | null;
  boundaryLayerHeightM?: number | null;
  convectiveInhibitionJkg?: number | null;
  sunshineTimeMinutes?: number | null;
};

export type CurrentSnapshot = {
  location: LocationChoice;
  timezone: string;
  elevation: number | null;
  sample: WeatherSample;
  verdict: FlightVerdict;
  sources: string[];
  provider: WeatherProviderInfo;
};

export type DayForecast = {
  date: string;
  location: LocationChoice;
  timezone: string;
  daily: {
    weatherCode: number | null;
    weatherLabel: string;
    temperatureMax: number | null;
    temperatureMin: number | null;
    precipitationSum: number | null;
    precipitationProbabilityMax: number | null;
    windSpeedMax: number | null;
    windGustsMax: number | null;
    uvIndexMax: number | null;
    sunrise: string | null;
    sunset: string | null;
    predictabilityPercent?: number | null;
    sunriseCalculated?: boolean;
    sunsetCalculated?: boolean;
    predictabilityCaution?: string | null;
  };
  samples: WeatherSample[];
  best: {
    sample: WeatherSample | null;
    verdict: FlightVerdict;
  };
  topWindows: Array<{
    sample: WeatherSample;
    verdict: FlightVerdict;
  }>;
  sources: string[];
  provider: WeatherProviderInfo;
};

export function evaluateFlight(
  sample: WeatherSample,
  locale: AppLocale = DEFAULT_LOCALE,
): FlightVerdict {
  const t = getTranslations(locale).weather;
  let score = 100;
  const hard: string[] = [];
  const cautions: string[] = [];
  const gustSpread =
    sample.windSpeed !== null && sample.windGusts !== null
      ? sample.windGusts - sample.windSpeed
      : null;

  const noGo = (reason: string, penalty: number) => {
    hard.push(reason);
    score -= penalty;
  };
  const caution = (reason: string, penalty: number) => {
    cautions.push(reason);
    score -= penalty;
  };

  if (sample.isDay === false) noGo(t.reasons.noLightAtArea, 45);
  if (sample.windSpeed === null) noGo(t.reasons.windUnavailable, 35);
  else if (sample.windSpeed < 4) noGo(t.reasons.windTooWeak, 30);
  else if (sample.windSpeed < 8) caution(t.reasons.windWeakVariable, 12);
  else if (sample.windSpeed > 28) noGo(t.reasons.windTooStrong, 40);
  else if (sample.windSpeed > 22) caution(t.reasons.windNearComfortLimit, 18);

  if (sample.windGusts === null) {
    if (sample.windGustOrigin !== "latest-within-3h") {
      caution(t.reasons.gustUnavailable, 10);
    }
  } else if (sample.windGusts > 35) noGo(t.reasons.gustTooStrong, 38);
  else if (sample.windGusts > 28) caution(t.reasons.gustElevated, 16);

  if (gustSpread !== null && gustSpread > 16) noGo(t.reasons.spreadLarge, 32);
  else if (gustSpread !== null && gustSpread > 10) caution(t.reasons.spreadAttention, 14);

  if (sample.precipitation !== null && sample.precipitation >= 0.2) {
    if (
      sample.snowFraction !== null &&
      sample.snowFraction !== undefined &&
      sample.snowFraction >= 0.5
    ) {
      noGo(t.reasons.heavyPrecipitation, 30);
    } else {
      noGo(t.reasons.activePrecipitation, 35);
    }
  }

  if (sample.precipitationProbability !== null && sample.precipitationProbability >= 45) {
    noGo(t.reasons.precipitationLikely, 25);
  } else if (sample.precipitationProbability !== null && sample.precipitationProbability >= 25) {
    caution(t.reasons.rainRiskRelevant, 12);
  }

  if (sample.weatherCode !== null) {
    if (sample.weatherCode >= 95) noGo(t.reasons.thunderstormRisk, 45);
    else if (sample.weatherCode >= 71 || sample.weatherCode === 65) {
      noGo(t.reasons.heavyPrecipitation, 30);
    } else if (
      [45, 48, 51, 53, 55, 56, 57, 61, 63, 66, 67, 80, 81, 82].includes(sample.weatherCode)
    ) {
      caution(t.reasons.weatherMayReduce(sample.weatherLabel), 12);
    }
  }

  if (sample.visibility !== null && sample.visibility < 5000) noGo(t.reasons.visibilityUnder5, 30);
  else if (sample.visibility !== null && sample.visibility < 10000) {
    caution(t.reasons.visibilityUnder10, 10);
  }

  if (sample.cape !== null && sample.cape > 1500) noGo(t.reasons.capeHigh, 35);
  else if (sample.cape !== null && sample.cape > 800) caution(t.reasons.capePossible, 14);

  if (
    sample.liftedIndex !== null &&
    sample.liftedIndex !== undefined &&
    sample.liftedIndex <= -2
  ) {
    caution(t.reasons.liftedIndexUnstable, 12);
  }

  if (sample.cloudCover !== null && sample.cloudCover > 90) caution(t.reasons.cloudCoverHigh, 8);
  if (
    sample.cloudCoverLow !== null &&
    sample.cloudCoverLow !== undefined &&
    sample.cloudCoverLow > 80
  ) {
    caution(t.reasons.lowCloudHigh, 8);
  }

  if (
    sample.windSpeed !== null &&
    sample.windSpeed80mKmh !== null &&
    sample.windSpeed80mKmh !== undefined &&
    sample.windSpeed80mKmh - sample.windSpeed >= 15
  ) {
    caution(t.reasons.windStrongerAloft, 10);
  }

  if (sample.usAqi !== null && sample.usAqi > 200) noGo(t.reasons.airQualityVeryPoor, 25);
  else if (sample.usAqi !== null && sample.usAqi > 150) caution(t.reasons.airQualityUnhealthy, 10);
  if (sample.uvIndex !== null && sample.uvIndex >= 8) caution(t.reasons.uvHigh, 6);

  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  if (hard.length > 0) {
    return {
      status: "no-go",
      title: t.titles.noGo,
      score: Math.min(safeScore, 44),
      reasons: hard,
      cautions,
    };
  }

  if (cautions.length > 0 || safeScore < 78) {
    return {
      status: "marginal",
      title: t.titles.marginal,
      score: Math.min(safeScore, 74),
      reasons: cautions.slice(0, 3),
      cautions: cautions.slice(3),
    };
  }

  return {
    status: "good",
    title: t.titles.good,
    score: safeScore,
    reasons: [t.reasons.good],
    cautions,
  };
}

export function dateForOffset(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatDateLabel(
  date: string,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function formatTime(
  value: string | null,
  timezone?: string,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  if (!value) return getTranslations(locale).common.notAvailable;
  const isOffsetTimestamp = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  const localTime = value.match(/T(\d{2}):(\d{2})/);

  if (localTime && !isOffsetTimestamp) {
    const [, hour, minute] = localTime;
    return new Intl.DateTimeFormat(getIntlLocale(locale), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(2000, 0, 1, Number(hour), Number(minute)));
  }

  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(new Date(value));
}

export function windDirectionLabel(
  degrees: number | null,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const t = getTranslations(locale);
  if (degrees === null) return t.common.notAvailable;
  return [
    t.directions.n,
    t.directions.ne,
    t.directions.e,
    t.directions.se,
    t.directions.s,
    t.directions.sw,
    t.directions.w,
    t.directions.nw,
  ][Math.round(degrees / 45) % 8];
}

export function numberLabel(
  value: number | null,
  unit: string,
  digits = 0,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  if (value === null || Number.isNaN(value)) {
    return getTranslations(locale).common.notAvailable;
  }
  const label = new Intl.NumberFormat(getIntlLocale(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
  const normalizedUnit =
    unit === "C" ? "°C" : unit === "ug/m3" ? "µg/m³" : unit;
  return `${label}${normalizedUnit ? ` ${normalizedUnit}` : ""}`;
}

export function percentLabel(
  value: number | null,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  return value === null
    ? getTranslations(locale).common.notAvailable
    : `${Math.round(value)}%`;
}

export function statusColor(status: FlightStatus) {
  if (status === "good") return "#4dffa5";
  if (status === "marginal") return "#ffd166";
  return "#ff5c7a";
}

export function weatherCodeLabel(
  code: number | null | undefined,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const t = getTranslations(locale).weather.codes;
  switch (code) {
    case 0:
      return t.clearSky;
    case 1:
      return t.mainlyClear;
    case 2:
      return t.partlyCloudy;
    case 3:
      return t.overcast;
    case 45:
    case 48:
      return t.fog;
    case 51:
    case 53:
    case 55:
      return t.drizzle;
    case 56:
    case 57:
      return t.freezingDrizzle;
    case 61:
    case 63:
      return t.rain;
    case 65:
      return t.heavyRain;
    case 66:
    case 67:
      return t.freezingRain;
    case 71:
    case 73:
    case 75:
      return t.snow;
    case 77:
      return t.snowGrains;
    case 80:
    case 81:
    case 82:
      return t.showers;
    case 85:
    case 86:
      return t.snowShowers;
    case 95:
      return t.thunderstorm;
    case 96:
    case 99:
      return t.thunderstormHail;
    default:
      return t.unavailable;
  }
}

export function providerDisplayName(provider: WeatherProviderInfo): string {
  if (provider.id === "meteoblue" && !provider.fallback) return "meteoblue";
  if (provider.id === "open-meteo" || provider.fallback) return "Open-Meteo";
  return provider.id;
}
