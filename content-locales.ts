export const COPY_LOCALES = [
  "en",
  "ro",
  "de",
  "it",
  "es",
  "pt",
  "cs",
  "sk",
  "sl",
  "nl",
  "mt",
  "tr",
  "hr",
  "sr",
  "sq",
] as const;

export type CopyLocale = (typeof COPY_LOCALES)[number];

export const CONTENT_LOCALE_IDS = [
  "en",
  "ro",
  "de",
  "at",
  "it",
  "es",
  "pt",
  "cz",
  "sk",
  "si",
  "be",
  "nl",
  "ie",
  "mt",
  "tr",
  "hr",
  "rs",
  "al",
] as const;

export type ContentLocale = (typeof CONTENT_LOCALE_IDS)[number];

export type ContentLocaleDefinition = {
  id: ContentLocale;
  copy: CopyLocale;
  /** Empty string for the unprefixed English site (United Kingdom). */
  prefix: string;
  hreflang: string;
  htmlLang: string;
  openGraphLocale: string;
  appLocale: string;
  nativeName: string;
  /** Appended to titles when a language is shared by more than one country site. */
  titleSuffix: string;
  descriptionLead: string;
  footerDestinationIds: readonly string[];
};

const site = (
  definition: ContentLocaleDefinition,
): ContentLocaleDefinition => definition;

export const CONTENT_LOCALES: readonly ContentLocaleDefinition[] = [
  site({
    id: "en",
    copy: "en",
    prefix: "",
    hreflang: "en",
    htmlLang: "en",
    openGraphLocale: "en_GB",
    appLocale: "en-GB",
    nativeName: "English",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "long-mynd",
      "combe-gibbet",
      "bradwell-edge",
      "ivinghoe-beacon",
      "southerndown",
      "frocester",
    ],
  }),
  site({
    id: "ro",
    copy: "ro",
    prefix: "ro",
    hreflang: "ro",
    htmlLang: "ro",
    openGraphLocale: "ro_RO",
    appLocale: "ro-RO",
    nativeName: "Română",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "spot-bunloc",
      "spot-clopotiva",
      "spot-postavarul",
      "spot-sirnea",
      "spot-pralea",
      "spot-rimetea",
    ],
  }),
  site({
    id: "de",
    copy: "de",
    prefix: "de",
    hreflang: "de-DE",
    htmlLang: "de",
    openGraphLocale: "de_DE",
    appLocale: "de-DE",
    nativeName: "Deutsch",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "wasserkuppe",
      "hornisgrinde",
      "tegelberg",
      "papststein",
      "kreuzberg-rhoen",
      "brauneck",
    ],
  }),
  site({
    id: "at",
    copy: "de",
    prefix: "at",
    hreflang: "de-AT",
    htmlLang: "de",
    openGraphLocale: "de_AT",
    appLocale: "de-AT",
    nativeName: "Deutsch (Österreich)",
    titleSuffix: "Österreich",
    descriptionLead: "Für Gleitschirmflieger in Österreich. ",
    footerDestinationIds: [
      "emberger-alm",
      "gerlitzen",
      "hafelekar",
      "grubigstein",
      "schmittenhoehe",
      "unterberghorn",
    ],
  }),
  site({
    id: "it",
    copy: "it",
    prefix: "it",
    hreflang: "it-IT",
    htmlLang: "it",
    openGraphLocale: "it_IT",
    appLocale: "it-IT",
    nativeName: "Italiano",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "bassano",
      "monte-cucco",
      "meduno",
      "monte-avena",
      "monte-bondone",
      "monte-carpegna",
    ],
  }),
  site({
    id: "es",
    copy: "es",
    prefix: "es",
    hreflang: "es-ES",
    htmlLang: "es",
    openGraphLocale: "es_ES",
    appLocale: "es-ES",
    nativeName: "Español",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "algodonales",
      "piedrahita",
      "ager",
      "castejon-de-sos",
      "el-yelmo",
      "ainsa",
    ],
  }),
  site({
    id: "pt",
    copy: "pt",
    prefix: "pt",
    hreflang: "pt-PT",
    htmlLang: "pt",
    openGraphLocale: "pt_PT",
    appLocale: "pt-PT",
    nativeName: "Português",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "linhares",
      "serra-da-estrela",
      "achadas-da-cruz",
      "aljezur",
      "foia",
      "miranda-do-corvo",
    ],
  }),
  site({
    id: "cz",
    copy: "cs",
    prefix: "cz",
    hreflang: "cs-CZ",
    htmlLang: "cs",
    openGraphLocale: "cs_CZ",
    appLocale: "cs-CZ",
    nativeName: "Čeština",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: ["rana", "kozakov", "bezdez", "dolni-morava", "jested", "cerna-hora"],
  }),
  site({
    id: "sk",
    copy: "sk",
    prefix: "sk",
    hreflang: "sk-SK",
    htmlLang: "sk",
    openGraphLocale: "sk_SK",
    appLocale: "sk-SK",
    nativeName: "Slovenčina",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "donovaly",
      "stranik",
      "martinske-hole",
      "krizna",
      "velka-raca",
      "chopok",
    ],
  }),
  site({
    id: "si",
    copy: "sl",
    prefix: "si",
    hreflang: "sl-SI",
    htmlLang: "sl",
    openGraphLocale: "sl_SI",
    appLocale: "sl-SI",
    nativeName: "Slovenščina",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: ["lijak", "kobala", "sorica", "vogel", "kovk", "ratitovec"],
  }),
  site({
    id: "be",
    copy: "nl",
    prefix: "be",
    hreflang: "nl-BE",
    htmlLang: "nl",
    openGraphLocale: "nl_BE",
    appLocale: "nl-BE",
    nativeName: "Nederlands (België)",
    titleSuffix: "België",
    descriptionLead: "Voor paragliders in België. ",
    footerDestinationIds: ["coo", "malchamps", "baraque-de-fraiture", "ovifat", "la-roche", "dinant"],
  }),
  site({
    id: "nl",
    copy: "nl",
    prefix: "nl",
    hreflang: "nl-NL",
    htmlLang: "nl",
    openGraphLocale: "nl_NL",
    appLocale: "nl-NL",
    nativeName: "Nederlands",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "wijk-aan-zee",
      "zoutelande",
      "schoorl",
      "bergen-aan-zee",
      "texel",
      "scheveningen",
    ],
  }),
  site({
    id: "ie",
    copy: "en",
    prefix: "ie",
    hreflang: "en-IE",
    htmlLang: "en",
    openGraphLocale: "en_IE",
    appLocale: "en-IE",
    nativeName: "English (Ireland)",
    titleSuffix: "Ireland",
    descriptionLead: "For paraglider pilots in Ireland. ",
    footerDestinationIds: [
      "mount-leinster",
      "great-sugar-loaf",
      "maulin",
      "benone",
      "knockmealdown",
      "muckish",
    ],
  }),
  site({
    id: "mt",
    copy: "mt",
    prefix: "mt",
    hreflang: "mt-MT",
    htmlLang: "mt",
    openGraphLocale: "mt_MT",
    appLocale: "mt-MT",
    nativeName: "Malti",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: ["dingli", "mellieha", "golden-bay", "wardija", "qrendi", "fomm-ir-rih"],
  }),
  site({
    id: "tr",
    copy: "tr",
    prefix: "tr",
    hreflang: "tr-TR",
    htmlLang: "tr",
    openGraphLocale: "tr_TR",
    appLocale: "tr-TR",
    nativeName: "Türkçe",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: ["oludeniz", "kas", "abant", "pamukkale", "hasan-dagi", "inonu"],
  }),
  site({
    id: "hr",
    copy: "hr",
    prefix: "hr",
    hreflang: "hr-HR",
    htmlLang: "hr",
    openGraphLocale: "hr_HR",
    appLocale: "hr-HR",
    nativeName: "Hrvatski",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: ["vidova-gora", "biokovo", "platak", "ivanscica", "medvednica", "hvar"],
  }),
  site({
    id: "rs",
    copy: "sr",
    prefix: "rs",
    hreflang: "sr-RS",
    htmlLang: "sr",
    openGraphLocale: "sr_RS",
    appLocale: "sr-RS",
    nativeName: "Srpski",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: [
      "divcibare",
      "zlatibor",
      "kopaonik",
      "fruska-gora",
      "stara-planina",
      "rtanj",
    ],
  }),
  site({
    id: "al",
    copy: "sq",
    prefix: "al",
    hreflang: "sq-AL",
    htmlLang: "sq",
    openGraphLocale: "sq_AL",
    appLocale: "sq-AL",
    nativeName: "Shqip",
    titleSuffix: "",
    descriptionLead: "",
    footerDestinationIds: ["llogara", "dajti", "valbona", "theth", "berat", "dhermi"],
  }),
];

const byId = new Map(CONTENT_LOCALES.map((entry) => [entry.id, entry]));
const byPrefix = new Map(
  CONTENT_LOCALES.filter((entry) => entry.prefix.length > 0).map((entry) => [entry.prefix, entry]),
);
const byAppLocale = new Map(CONTENT_LOCALES.map((entry) => [entry.appLocale, entry]));

export function isContentLocale(value: string): value is ContentLocale {
  return byId.has(value as ContentLocale);
}

export function contentLocaleDefinition(locale: ContentLocale): ContentLocaleDefinition {
  const definition = byId.get(locale);
  if (!definition) {
    throw new Error(`Unknown content locale: ${locale}`);
  }
  return definition;
}

export function contentLocaleFromPathname(pathname: string): ContentLocale {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return "en";
  return byPrefix.get(segment)?.id ?? "en";
}

export function contentLocaleForAppLocaleCode(appLocale: string): ContentLocale {
  if (appLocale === "ro-MD") return "ro";
  return byAppLocale.get(appLocale)?.id ?? "en";
}

export function localeHomePath(locale: ContentLocale): string {
  const prefix = contentLocaleDefinition(locale).prefix;
  return prefix ? `/${prefix}` : "/";
}
