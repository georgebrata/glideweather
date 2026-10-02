export const PRODUCT_NAME = "GlideWeather";

export const PRODUCTION_ORIGIN = "https://glideweather.app";

export const TEST_ORIGIN = "https://glideweather.vercel.app";

export const THEME_STORAGE_KEY = "glideweather-theme";

export const LEGACY_THEME_STORAGE_KEYS = ["windwatch-theme", "parapantabil-theme"] as const;

export const LOCALE_STORAGE_KEY = "glideweather-locale";

export const LEGACY_LOCALE_STORAGE_KEYS = ["parapantabil-locale"] as const;

export const MARK_SRC = "/glideweather-mark.svg";

export function resolveSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_ORIGIN;
  if (process.env.VERCEL_ENV === "preview") return TEST_ORIGIN;
  return "http://localhost:3000";
}
