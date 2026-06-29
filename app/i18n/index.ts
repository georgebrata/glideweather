import { en } from "./locales/en";
import { ro } from "./locales/ro";

const dictionaryLocales = {
  "en-GB": en,
  "ro-RO": ro,
} as const;

type DictionaryLocale = keyof typeof dictionaryLocales;

export type EuropeanLocaleOption = {
  code: string;
  countryCode: string;
  countryName: string;
  nativeCountryName: string;
  languageName: string;
  nativeLanguageName: string;
  intlLocale: string;
  dictionaryLocale: DictionaryLocale;
  openMeteoLanguage: string;
};

const option = (
  code: string,
  countryCode: string,
  countryName: string,
  nativeCountryName: string,
  languageName: string,
  nativeLanguageName: string,
  dictionaryLocale: DictionaryLocale = "en-GB",
  openMeteoLanguage = "en",
): EuropeanLocaleOption => ({
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

export const EUROPEAN_LOCALE_OPTIONS = [
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
  option("es-ES", "ES", "Spain", "España", "Spanish", "Español"),
  option("sv-SE", "SE", "Sweden", "Sverige", "Swedish", "Svenska", "en-GB", "sv"),
  option("de-CH", "CH", "Switzerland", "Schweiz", "German", "Deutsch", "en-GB", "de"),
  option("tr-TR", "TR", "Turkey", "Türkiye", "Turkish", "Türkçe", "en-GB", "tr"),
  option("uk-UA", "UA", "Ukraine", "Україна", "Ukrainian", "Українська", "en-GB", "uk"),
  option("en-GB", "GB", "United Kingdom", "United Kingdom", "English", "English", "en-GB", "en"),
  option("it-VA", "VA", "Vatican City", "Città del Vaticano", "Italian", "Italiano", "en-GB", "it"),
] as const;

export type AppLocale = (typeof EUROPEAN_LOCALE_OPTIONS)[number]["code"];

export const DEFAULT_LOCALE: AppLocale = "ro-RO";

const localeOptionsByCode = new Map(
  EUROPEAN_LOCALE_OPTIONS.map((localeOption) => [localeOption.code, localeOption]),
);

export function isAppLocale(value: string | null): value is AppLocale {
  return Boolean(value && localeOptionsByCode.has(value));
}

export function getLocaleOption(locale: AppLocale): EuropeanLocaleOption {
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

export function getLocaleOptionLabel(localeOption: EuropeanLocaleOption) {
  return `${localeOption.nativeCountryName} · ${localeOption.nativeLanguageName}`;
}

export type LocaleText = ReturnType<typeof getTranslations>;
