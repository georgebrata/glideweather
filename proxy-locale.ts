import {
  CONTENT_LOCALES,
  contentLocaleFromPathname as localeFromPath,
  localeHomePath,
  type ContentLocale,
} from "./content-locales";

export const CONTENT_LOCALE_HEADER = "x-content-locale";

export const CONTENT_LOCALE_COOKIE = "gw-content-locale";

export type ProxyContentLocale = ContentLocale;

export function contentLocaleFromPathname(pathname: string): ProxyContentLocale {
  return localeFromPath(pathname);
}

const clerkHomePaths = new Set(CONTENT_LOCALES.map((entry) => localeHomePath(entry.id)));

/** Routes that run Clerk middleware when auth is enabled (console, auth UI, profile). */
export function isClerkScopedPath(pathname: string): boolean {
  if (clerkHomePaths.has(pathname)) {
    return true;
  }
  if (
    pathname === "/sign-in" ||
    pathname.startsWith("/sign-in/") ||
    pathname === "/sign-up" ||
    pathname.startsWith("/sign-up/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/")
  ) {
    return true;
  }
  if (pathname.startsWith("/__clerk")) {
    return true;
  }
  return false;
}
