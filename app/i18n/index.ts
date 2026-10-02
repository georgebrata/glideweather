import { en } from "./locales/en";
import { ro } from "./locales/ro";

const dictionaryLocales = {
  "en-GB": en,
  "ro-RO": ro,
} as const;

type DictionaryLocale = keyof typeof dictionaryLocales;

const option = <const TCode extends string>(
  code: TCode,
  countryCode: string,
  countryName: string,
  nativeCountryName: string,
  languageName: string,
  nativeLanguageName: string,
  dictionaryLocale: DictionaryLocale = "en-GB",
  openMeteoLanguage = "en",
) => ({
  code,
  countryCode,
  countryName,
  nativeCountryName,
  languageName,
  nativeLanguageName,
  intlLocale: code,
  dictionaryLocale,
  openMeteoLanguage,
});

export const LOCALE_OPTIONS = [
  option("sq-AL", "AL", "Albania", "Shqipëria", "Albanian", "Shqip"),
  option("ca-AD", "AD", "Andorra", "Andorra", "Catalan", "Català", "en-GB", "ca"),
  option("hy-AM", "AM", "Armenia", "Հայաստան", "Armenian", "Հայերեն"),
  option("de-AT", "AT", "Austria", "Österreich", "German", "Deutsch", "en-GB", "de"),
  option("az-AZ", "AZ", "Azerbaijan", "Azərbaycan", "Azerbaijani", "Azərbaycanca"),
  option("be-BY", "BY", "Belarus", "Беларусь", "Belarusian", "Беларуская"),
  option("nl-BE", "BE", "Belgium", "België", "Dutch", "Nederlands", "en-GB", "nl"),
  option("bs-BA", "BA", "Bosnia and Herzegovina", "Bosna i Hercegovina", "Bosnian", "Bosanski"),
  option("bg-BG", "BG", "Bulgaria", "България", "Bulgarian", "Български", "en-GB", "bg"),
  option("hr-HR", "HR", "Croatia", "Hrvatska", "Croatian", "Hrvatski"),
  option("el-CY", "CY", "Cyprus", "Κύπρος", "Greek", "Ελληνικά", "en-GB", "el"),
  option("cs-CZ", "CZ", "Czechia", "Česko", "Czech", "Čeština", "en-GB", "cs"),
  option("da-DK", "DK", "Denmark", "Danmark", "Danish", "Dansk", "en-GB", "da"),
  option("et-EE", "EE", "Estonia", "Eesti", "Estonian", "Eesti keel"),
  option("fi-FI", "FI", "Finland", "Suomi", "Finnish", "Suomi", "en-GB", "fi"),
  option("fr-FR", "FR", "France", "France", "French", "Français", "en-GB", "fr"),
  option("ka-GE", "GE", "Georgia", "საქართველო", "Georgian", "ქართული"),
  option("de-DE", "DE", "Germany", "Deutschland", "German", "Deutsch", "en-GB", "de"),
  option("el-GR", "GR", "Greece", "Ελλάδα", "Greek", "Ελληνικά", "en-GB", "el"),
  option("hu-HU", "HU", "Hungary", "Magyarország", "Hungarian", "Magyar", "en-GB", "hu"),
  option("is-IS", "IS", "Iceland", "Ísland", "Icelandic", "Íslenska"),
  option("en-IE", "IE", "Ireland", "Ireland", "English", "English", "en-GB", "en"),
  option("it-IT", "IT", "Italy", "Italia", "Italian", "Italiano", "en-GB", "it"),
  option("sq-XK", "XK", "Kosovo", "Kosova", "Albanian", "Shqip"),
  option("lv-LV", "LV", "Latvia", "Latvija", "Latvian", "Latviešu"),
  option("de-LI", "LI", "Liechtenstein", "Liechtenstein", "German", "Deutsch", "en-GB", "de"),
  option("lt-LT", "LT", "Lithuania", "Lietuva", "Lithuanian", "Lietuvių"),
  option("lb-LU", "LU", "Luxembourg", "Lëtzebuerg", "Luxembourgish", "Lëtzebuergesch"),
  option("mt-MT", "MT", "Malta", "Malta", "Maltese", "Malti"),
  option("ro-MD", "MD", "Moldova", "Moldova", "Romanian", "Română", "ro-RO", "ro"),
  option("fr-MC", "MC", "Monaco", "Monaco", "French", "Français", "en-GB", "fr"),
  option("sr-ME", "ME", "Montenegro", "Crna Gora", "Serbian", "Srpski", "en-GB", "sr"),
  option("nl-NL", "NL", "Netherlands", "Nederland", "Dutch", "Nederlands", "en-GB", "nl"),
  option("mk-MK", "MK", "North Macedonia", "Северна Македонија", "Macedonian", "Македонски"),
  option("nb-NO", "NO", "Norway", "Norge", "Norwegian", "Norsk"),
  option("pl-PL", "PL", "Poland", "Polska", "Polish", "Polski", "en-GB", "pl"),
  option("pt-PT", "PT", "Portugal", "Portugal", "Portuguese", "Português", "en-GB", "pt"),
  option("ro-RO", "RO", "Romania", "România", "Romanian", "Română", "ro-RO", "ro"),
  option("ru-RU", "RU", "Russia", "Россия", "Russian", "Русский", "en-GB", "ru"),
  option("it-SM", "SM", "San Marino", "San Marino", "Italian", "Italiano", "en-GB", "it"),
  option("sr-RS", "RS", "Serbia", "Srbija", "Serbian", "Srpski", "en-GB", "sr"),
  option("sk-SK", "SK", "Slovakia", "Slovensko", "Slovak", "Slovenčina", "en-GB", "sk"),
  option("sl-SI", "SI", "Slovenia", "Slovenija", "Slovenian", "Slovenščina", "en-GB", "sl"),
  option("es-ES", "ES", "Spain", "España", "Spanish", "Español", "en-GB", "es"),
  option("sv-SE", "SE", "Sweden", "Sverige", "Swedish", "Svenska", "en-GB", "sv"),
  option("de-CH", "CH", "Switzerland", "Schweiz", "German", "Deutsch", "en-GB", "de"),
  option("tr-TR", "TR", "Turkey", "Türkiye", "Turkish", "Türkçe", "en-GB", "tr"),
  option("uk-UA", "UA", "Ukraine", "Україна", "Ukrainian", "Українська", "en-GB", "uk"),
  option("en-GB", "GB", "United Kingdom", "United Kingdom", "English", "English", "en-GB", "en"),
  option("it-VA", "VA", "Vatican City", "Città del Vaticano", "Italian", "Italiano", "en-GB", "it"),
  option("en-US", "US", "United States", "United States", "English", "English"),
  option("en-CA", "CA", "Canada", "Canada", "English", "English"),
  option("fr-CA", "CA", "Canada", "Canada", "French", "Français", "en-GB", "fr"),
  option("es-MX", "MX", "Mexico", "México", "Spanish", "Español", "en-GB", "es"),
  option("pt-BR", "BR", "Brazil", "Brasil", "Portuguese", "Português", "en-GB", "pt"),
  option("es-AR", "AR", "Argentina", "Argentina", "Spanish", "Español", "en-GB", "es"),
  option("es-CL", "CL", "Chile", "Chile", "Spanish", "Español", "en-GB", "es"),
  option("es-CO", "CO", "Colombia", "Colombia", "Spanish", "Español", "en-GB", "es"),
  option("en-ZA", "ZA", "South Africa", "South Africa", "English", "English"),
  option("ar-EG", "EG", "Egypt", "مصر", "Arabic", "العربية", "en-GB", "ar"),
  option("ar-MA", "MA", "Morocco", "المغرب", "Arabic", "العربية", "en-GB", "ar"),
  option("en-NG", "NG", "Nigeria", "Nigeria", "English", "English"),
  option("en-KE", "KE", "Kenya", "Kenya", "English", "English"),
  option("ar-SA", "SA", "Saudi Arabia", "السعودية", "Arabic", "العربية", "en-GB", "ar"),
  option("ar-AE", "AE", "United Arab Emirates", "الإمارات", "Arabic", "العربية", "en-GB", "ar"),
  option("he-IL", "IL", "Israel", "ישראל", "Hebrew", "עברית"),
  option("en-IN", "IN", "India", "India", "English", "English"),
  option("zh-CN", "CN", "China", "中国", "Chinese", "中文", "en-GB", "zh"),
  option("ja-JP", "JP", "Japan", "日本", "Japanese", "日本語", "en-GB", "ja"),
  option("ko-KR", "KR", "South Korea", "대한민국", "Korean", "한국어", "en-GB", "ko"),
  option("zh-TW", "TW", "Taiwan", "台灣", "Chinese", "中文", "en-GB", "zh"),
  option("th-TH", "TH", "Thailand", "ประเทศไทย", "Thai", "ไทย"),
  option("vi-VN", "VN", "Vietnam", "Việt Nam", "Vietnamese", "Tiếng Việt"),
  option("id-ID", "ID", "Indonesia", "Indonesia", "Indonesian", "Bahasa Indonesia"),
  option("en-PH", "PH", "Philippines", "Pilipinas", "English", "English"),
  option("en-SG", "SG", "Singapore", "Singapore", "English", "English"),
  option("ms-MY", "MY", "Malaysia", "Malaysia", "Malay", "Bahasa Melayu"),
  option("en-AU", "AU", "Australia", "Australia", "English", "English"),
  option("en-NZ", "NZ", "New Zealand", "New Zealand", "English", "English"),
] as const;

export type LocaleOption = (typeof LOCALE_OPTIONS)[number];

export type AppLocale = LocaleOption["code"];

export const DEFAULT_LOCALE: AppLocale = "en-GB";

const localeOptionsByCode = new Map<AppLocale, LocaleOption>(
  LOCALE_OPTIONS.map((localeOption) => [localeOption.code, localeOption]),
);
const localeCodes = new Set<string>(LOCALE_OPTIONS.map((localeOption) => localeOption.code));

export function isAppLocale(value: string | null): value is AppLocale {
  return Boolean(value && localeCodes.has(value));
}

export function getLocaleOption(locale: AppLocale): LocaleOption {
  return localeOptionsByCode.get(locale) ?? localeOptionsByCode.get(DEFAULT_LOCALE)!;
}

export function getTranslations(locale: AppLocale) {
  return dictionaryLocales[getLocaleOption(locale).dictionaryLocale];
}

export function getIntlLocale(locale: AppLocale) {
  return getLocaleOption(locale).intlLocale;
}

export function getOpenMeteoLanguage(locale: AppLocale) {
  return getLocaleOption(locale).openMeteoLanguage;
}

export function getLocaleButtonLabel(locale: AppLocale) {
  const localeOption = getLocaleOption(locale);
  return `${localeOption.countryCode} · ${localeOption.nativeLanguageName}`;
}

export function getLocaleOptionLabel(localeOption: LocaleOption) {
  return `${localeOption.nativeCountryName} · ${localeOption.nativeLanguageName}`;
}

const preferredLocaleByLanguage: Record<string, AppLocale> = {
  ar: "ar-SA",
  de: "de-DE",
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-PT",
  ro: "ro-RO",
  zh: "zh-CN",
};

export function matchBrowserLocale(value: string | null | undefined): AppLocale | null {
  if (!value) return null;
  if (isAppLocale(value)) return value;

  const language = value.toLowerCase().split("-")[0];
  const preferred = preferredLocaleByLanguage[language];
  if (preferred) return preferred;

  return LOCALE_OPTIONS.find((localeOption) => localeOption.code.toLowerCase().startsWith(`${language}-`))?.code ?? null;
}

export type LocaleText = ReturnType<typeof getTranslations>;
