import { cookies, headers } from "next/headers";
import { isContentLocale, type ContentLocale } from "../../content-locales";
import { documentLang } from "./locale";
import { CONTENT_LOCALE_COOKIE, CONTENT_LOCALE_HEADER } from "../../proxy-locale";

function asContentLocale(value: string | null | undefined): ContentLocale | null {
  if (value && isContentLocale(value)) return value;
  return null;
}

export async function getServerContentLocale(): Promise<ContentLocale> {
  const headerStore = await headers();
  const fromHeader = asContentLocale(headerStore.get(CONTENT_LOCALE_HEADER));
  if (fromHeader) return fromHeader;
  const cookieStore = await cookies();
  const fromCookie = asContentLocale(cookieStore.get(CONTENT_LOCALE_COOKIE)?.value);
  if (fromCookie) return fromCookie;
  return "en";
}

export async function getServerDocumentLang(): Promise<string> {
  return documentLang(await getServerContentLocale());
}
