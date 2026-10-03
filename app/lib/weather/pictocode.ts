import { DEFAULT_LOCALE, getTranslations, type AppLocale } from "../../i18n";

/** Hourly pictocode labels (subset). Unknown codes return unavailable — never mapped to WMO thunderstorm branches. */
export function pictocodeLabel(
  code: number | null | undefined,
  locale: AppLocale = DEFAULT_LOCALE,
): string {
  const unavailable = getTranslations(locale).weather.codes.unavailable;
  if (code === null || code === undefined) return unavailable;

  const t = getTranslations(locale).weather.pictocode;
  const map: Record<number, string> = {
    1: t.clear,
    2: t.mainlyClear,
    3: t.partlyCloudy,
    4: t.overcast,
    5: t.fog,
    6: t.lightRain,
    7: t.rain,
    8: t.heavyRain,
    9: t.sleet,
    10: t.snow,
    11: t.heavySnow,
    12: t.lightRainShowers,
    13: t.rainShowers,
    14: t.heavyRainShowers,
    15: t.lightSnowShowers,
    16: t.snowShowers,
    17: t.lightRainThunder,
    18: t.rainThunder,
    19: t.heavyRainThunder,
    20: t.sleetThunder,
  };

  return map[code] ?? unavailable;
}
