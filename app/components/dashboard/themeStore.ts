import {
  LEGACY_LOCALE_STORAGE_KEYS,
  LEGACY_THEME_STORAGE_KEYS,
  LOCALE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../brand";
import { DEFAULT_LOCALE, isAppLocale, matchBrowserLocale, type AppLocale } from "../../i18n";
import type { ThemeMode } from "../../theme/flightTokens";

const themeModeListeners = new Set<() => void>();
const localeListeners = new Set<() => void>();
let memoryThemeMode: ThemeMode | null = null;
let memoryLocale: AppLocale | null = null;
let legacyThemeMigrated = false;

function readStoredThemeMode(): ThemeMode | null {
  try {
    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedMode === "dark" || storedMode === "light") return storedMode;

    const legacyMode = LEGACY_THEME_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(
      (value): value is ThemeMode => value === "dark" || value === "light",
    );
    if (!legacyMode) return null;

    if (!legacyThemeMigrated) {
      legacyThemeMigrated = true;
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, legacyMode);
      } catch {
        // ignore
      }
    }
    return legacyMode;
  } catch {
    return null;
  }
}

export function readInitialThemeMode(): ThemeMode {
  if (memoryThemeMode) return memoryThemeMode;
  if (typeof window === "undefined") return "dark";

  return (
    readStoredThemeMode() ??
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
  );
}

export function subscribeThemeMode(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  themeModeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === THEME_STORAGE_KEY ||
      LEGACY_THEME_STORAGE_KEYS.some((key) => key === event.key)
    ) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    themeModeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getServerThemeMode(): ThemeMode {
  return "dark";
}

export function writeThemeMode(mode: ThemeMode) {
  memoryThemeMode = mode;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore
  }

  themeModeListeners.forEach((listener) => listener());
}

export function readInitialLocale(): AppLocale {
  if (memoryLocale) return memoryLocale;
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isAppLocale(storedLocale)) return storedLocale;

    const legacyLocale = LEGACY_LOCALE_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(isAppLocale);
    if (legacyLocale) {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, legacyLocale);
      } catch {
        // ignore
      }
      return legacyLocale;
    }

    const browserLocale = window.navigator.languages
      .map((language) => matchBrowserLocale(language))
      .find((language): language is AppLocale => language !== null);
    return browserLocale ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function subscribeLocale(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  localeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY || LEGACY_LOCALE_STORAGE_KEYS.some((key) => key === event.key)) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    localeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getServerLocale(): AppLocale {
  return DEFAULT_LOCALE;
}

export function writeLocale(locale: AppLocale) {
  memoryLocale = locale;

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }

  localeListeners.forEach((listener) => listener());
}
