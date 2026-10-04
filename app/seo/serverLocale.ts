import { cookies, headers } from "next/headers";
import { documentLang } from "./locale";
import type { ContentLocale } from "./types";
import { CONTENT_LOCALE_COOKIE, CONTENT_LOCALE_HEADER } from "../../proxy-locale";

export async function getServerContentLocale(): Promise<ContentLocale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(CONTENT_LOCALE_HEADER);
  if (fromHeader === "ro") return "ro";
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(CONTENT_LOCALE_COOKIE)?.value;
  if (fromCookie === "ro") return "ro";
  return "en";
}

export async function getServerDocumentLang(): Promise<string> {
  return documentLang(await getServerContentLocale());
}
