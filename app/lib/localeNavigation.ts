import { getLocaleOption, type AppLocale } from "@/app/i18n";
import { alternatePath } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";

export function defaultAppLocaleForContent(contentLocale: ContentLocale): AppLocale {
  return contentLocale === "ro" ? "ro-RO" : "en-GB";
}

export function contentLocaleForAppLocale(locale: AppLocale): ContentLocale {
  const option = getLocaleOption(locale);
  if (option.dictionaryLocale === "ro-RO" || option.code === "ro-MD") {
    return "ro";
  }
  return "en";
}

export function pathAfterLocaleChange(pathname: string, nextLocale: AppLocale): string {
  const targetContent = contentLocaleForAppLocale(nextLocale);
  return alternatePath(pathname, targetContent) ?? (targetContent === "ro" ? "/ro" : "/");
}
