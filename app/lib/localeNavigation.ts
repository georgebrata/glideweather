import {
  contentLocaleDefinition,
  contentLocaleForAppLocaleCode,
  localeHomePath,
} from "../../content-locales";
import { getLocaleOption, type AppLocale } from "@/app/i18n";
import { alternatePath } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";

export function defaultAppLocaleForContent(contentLocale: ContentLocale): AppLocale {
  return contentLocaleDefinition(contentLocale).appLocale as AppLocale;
}

export function contentLocaleForAppLocale(locale: AppLocale): ContentLocale {
  const option = getLocaleOption(locale);
  return contentLocaleForAppLocaleCode(option.code);
}

export function pathAfterLocaleChange(pathname: string, nextLocale: AppLocale): string {
  const targetContent = contentLocaleForAppLocale(nextLocale);
  return alternatePath(pathname, targetContent) ?? localeHomePath(targetContent);
}
