import { DEFAULT_LOCALE, getIntlLocale, getTranslations, type AppLocale } from "../i18n";
import {
  evaluateFlight,
  formatTime,
  type FlightStatus,
  type FlightVerdict,
  type WeatherSample,
} from "./weather";

export function estimateCloudBaseMeters(
  temperatureC: number | null,
  humidityPercent: number | null,
): number | null {
  if (temperatureC === null || humidityPercent === null) return null;
  const spread = (100 - humidityPercent) / 5;
  return Math.max(0, spread * 125);
}

export function visibilityClarityLabel(
  visibilityMeters: number | null,
  locale: AppLocale = DEFAULT_LOCALE,
): string {
  const t = getTranslations(locale).flightWindow;
  if (visibilityMeters === null) return t.visibilityUnknown;
  const km = visibilityMeters / 1000;
  if (km >= 20) return t.visibilityExcellent;
  if (km >= 10) return t.visibilityGood;
  if (km >= 5) return t.visibilityModerate;
  return t.visibilityPoor;
}

export function ringStatusLabel(status: FlightStatus, locale: AppLocale = DEFAULT_LOCALE) {
  const t = getTranslations(locale).flightWindow;
  if (status === "good") return t.ringGo;
  if (status === "marginal") return t.ringWait;
  return t.ringNo;
}

export function favorableUntilMessage(
  samples: WeatherSample[],
  currentStatus: FlightStatus,
  timezone: string,
  locale: AppLocale = DEFAULT_LOCALE,
): string {
  const t = getTranslations(locale).flightWindow;
  const now = Date.now();
  const future = samples
    .filter((sample) => {
      const ts = Date.parse(sample.time);
      return !Number.isNaN(ts) && ts >= now - 1000 * 60 * 30;
    })
    .sort((a, b) => Date.parse(a.time) - Date.parse(b.time));

  let lastMatching = future[0];
  for (const sample of future) {
    const verdict = evaluateFlight(sample, locale);
    if (verdict.status !== currentStatus) break;
    lastMatching = sample;
  }

  if (!lastMatching) {
    if (currentStatus === "good") return t.conditionsFavorableBrief;
    if (currentStatus === "marginal") return t.conditionsMarginalBrief;
    return t.conditionsNoGoBrief;
  }

  const until = formatTime(lastMatching.time, timezone, locale);
  if (currentStatus === "good") return t.conditionsFavorableUntil(until);
  if (currentStatus === "marginal") return t.conditionsMarginalUntil(until);
  return t.conditionsNoGoUntil(until);
}

export function minutesSinceUpdate(sampleTime: string | null, locale: AppLocale = DEFAULT_LOCALE) {
  const t = getTranslations(locale).flightWindow;
  if (!sampleTime) return t.updatedJustNow;
  const diffMs = Date.now() - Date.parse(sampleTime);
  if (Number.isNaN(diffMs) || diffMs < 60_000) return t.updatedJustNow;
  const minutes = Math.max(1, Math.round(diffMs / 60_000));
  return t.updatedMinutesAgo(minutes);
}

export function nextSixHourSlots(samples: WeatherSample[], timezone: string, locale: AppLocale) {
  const now = Date.now();
  const upcoming = samples
    .filter((sample) => {
      const ts = Date.parse(sample.time);
      return !Number.isNaN(ts) && ts >= now - 1000 * 60 * 15;
    })
    .sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
    .slice(0, 6);

  return upcoming.map((sample, index) => {
    const verdict = evaluateFlight(sample, locale);
    const windMs = sample.windSpeed === null ? null : sample.windSpeed / 3.6;
    const prevWind = index > 0 ? upcoming[index - 1].windSpeed : null;
    const increasing =
      sample.windSpeed !== null &&
      prevWind !== null &&
      sample.windSpeed - prevWind >= 3;
    const barTone =
      verdict.status === "good" && !increasing
        ? "ideal"
        : increasing || verdict.status === "marginal"
          ? "wind"
          : verdict.status === "no-go"
            ? "wind"
            : "ideal";

    const label =
      index === 0
        ? getTranslations(locale).flightWindow.nowLabel
        : formatTime(sample.time, timezone, locale);

    return {
      sample,
      verdict,
      windMs,
      barTone,
      label,
      temperature: sample.temperature,
    };
  });
}

export function verdictHeadline(verdict: FlightVerdict, locale: AppLocale = DEFAULT_LOCALE) {
  const t = getTranslations(locale).flightWindow;
  if (verdict.status === "good") return t.headlineGood;
  if (verdict.status === "marginal") return t.headlineMarginal;
  return t.headlineNoGo;
}

export function formatCloudBaseDisplay(
  meters: number | null,
  elevationM: number | null,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const t = getTranslations(locale).flightWindow;
  if (meters === null) return { primary: "—", secondary: t.cloudBaseEstimated };
  const feet = Math.round(meters * 3.28084);
  const primary = new Intl.NumberFormat(getIntlLocale(locale)).format(feet) + " ft";
  const metersLabel = new Intl.NumberFormat(getIntlLocale(locale)).format(Math.round(meters)) + " m";
  const above =
    elevationM !== null
      ? t.aboveLaunch(Math.max(0, Math.round(meters - elevationM)))
      : metersLabel;
  return { primary, secondary: `${t.cloudBaseEstimated} · ${above}` };
}
