import { en, type LocaleText } from "./en";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function withEnglish(base: unknown, patch: unknown): unknown {
  if (typeof base === "function") {
    return typeof patch === "function" ? patch : base;
  }
  if (!isRecord(base) || !isRecord(patch)) {
    return patch === undefined ? base : patch;
  }
  const output: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    output[key] = withEnglish(base[key], value);
  }
  return output;
}

const locale = (patch: unknown) => withEnglish(en, patch) as LocaleText;

const disclaimer = {
  de: "Entscheidungshilfe, keine Flugfreigabe. Prüfe den echten Wind am Start, Rotor, Konvektion, Gebietsregeln und deine eigenen Limits.",
  it: "Aiuto alla decisione, non autorizzazione al volo. Verifica il vento reale in decollo, il rotore, la convezione, le regole dell’area e i tuoi limiti.",
  es: "Ayuda para decidir, no autorización de vuelo. Confirma el viento real en el despegue, el rotor, la convección, las normas de la zona y tus propios límites.",
  pt: "Ajuda à decisão, não autorização de voo. Confirma o vento real na descolagem, o rotor, a convecção, as regras da zona e os teus limites.",
  cs: "Pomůcka k rozhodnutí, ne povolení letu. Ověř skutečný vítr na startu, rotor, konvekci, pravidla terénu a vlastní limity.",
  sk: "Pomôcka na rozhodnutie, nie povolenie letu. Over skutočný vietor na štarte, rotor, konvekciu, pravidlá terénu a vlastné limity.",
  sl: "Pomoč pri odločitvi, ne dovoljenje za let. Preveri pravi veter na vzletišču, rotor, konvekcijo, pravila območja in lastne meje.",
  nl: "Beslishulp, geen vliegtoestemming. Controleer de echte wind op de start, rotor, convectie, gebiedsregels en je eigen limieten.",
  mt: "Għajnuna għad-deċiżjoni, mhux awtorizzazzjoni tat-titjira. Ikkonferma r-riħ veru fit-tlugħ, ir-rotor, il-konvezzjoni, ir-regoli taż-żona u l-limiti tiegħek.",
  tr: "Karar desteği, uçuş izni değil. Kalkıştaki gerçek rüzgarı, rotoru, konveksiyonu, alan kurallarını ve kendi limitlerini doğrula.",
  hr: "Pomoć pri odluci, ne odobrenje leta. Provjeri stvarni vjetar na startu, rotor, konvekciju, pravila područja i vlastite granice.",
  sr: "Pomoć pri odluci, ne odobrenje leta. Proveri stvarni vetar na startu, rotor, konvekciju, pravila područja i sopstvene granice.",
  sq: "Ndihmë për vendim, jo autorizim fluturimi. Konfirmo erën e vërtetë në nisje, rotorin, konveksionin, rregullat e zonës dhe kufijtë e tu.",
} as const;

function pack(
  code: keyof typeof disclaimer,
  native: string,
  languageName: string,
  title: string,
  description: string,
  flightTitle: string,
  subtitle: string,
  search: string,
  locate: string,
  good: string,
  marginal: string,
  noGo: string,
) {
  const line = disclaimer[code];
  return locale({
    meta: {
      documentLang: code,
      localeName: languageName,
      nativeName: native,
      title,
      description,
    },
    language: { label: native, tooltip: native },
    decision: { disclaimer: line },
    flightWindow: {
      title: flightTitle,
      subtitle,
      searchPlaceholder: search,
      locateMe: locate,
      headlineGood: good,
      headlineMarginal: marginal,
      headlineNoGo: noGo,
      footerAttribution: `GlideWeather · ${line}`,
    },
    weather: {
      titles: { good, marginal, noGo },
    },
    console: { footer: `GlideWeather · ${line}` },
    header: { searchPlaceholder: search, searchLabel: search },
    empty: { title: flightTitle, body: subtitle, detectPosition: locate },
    location: { currentPosition: locate, useBrowserPosition: locate },
  });
}

export const de = pack(
  "de",
  "Deutsch",
  "German",
  "GlideWeather · Flugwetter",
  "Startentscheidung für Gleitschirm: Wind, Böen, Sicht und Labilität.",
  "Gleitschirm-Flugfenster",
  "Hyperlokale Fluginfo für Gleitschirmpiloten, einen Klick entfernt.",
  "Startplatz oder Ort suchen...",
  "Standort verwenden",
  "Gut zum Fliegen",
  "Grenzbedingungen",
  "Nicht fliegen",
);

export const it = pack(
  "it",
  "Italiano",
  "Italian",
  "GlideWeather · Meteo di volo",
  "Verdetto di decollo per parapendio: vento, raffiche, visibilità e instabilità.",
  "Finestra di volo parapendio",
  "Meteo di volo iperlocale per piloti di parapendio, a un clic.",
  "Cerca un decollo o una località...",
  "Usa la posizione",
  "Buono per volare",
  "Condizioni marginali",
  "Non volare",
);

export const es = pack(
  "es",
  "Español",
  "Spanish",
  "GlideWeather · Meteo de vuelo",
  "Veredicto de despegue para parapente: viento, rachas, visibilidad e inestabilidad.",
  "Ventana de vuelo de parapente",
  "Información de vuelo hiperlocal para pilotos de parapente, a un clic.",
  "Busca un despegue o una localidad...",
  "Usar mi ubicación",
  "Bueno para volar",
  "Condiciones marginales",
  "No volar",
);

export const pt = pack(
  "pt",
  "Português",
  "Portuguese",
  "GlideWeather · Meteo de voo",
  "Veredito de descolagem para parapente: vento, rajadas, visibilidade e instabilidade.",
  "Janela de voo de parapente",
  "Informação de voo hiperlocal para pilotos de parapente, a um clique.",
  "Procura uma descolagem ou uma localidade...",
  "Usar a minha localização",
  "Bom para voar",
  "Condições marginais",
  "Não voar",
);

export const cs = pack(
  "cs",
  "Čeština",
  "Czech",
  "GlideWeather · Letové počasí",
  "Verdikt startu pro paragliding: vítr, nárazy, dohlednost a nestabilita.",
  "Letové okno paraglidingu",
  "Hyperlokální letové info pro paragliding, na jedno kliknutí.",
  "Hledej start nebo místo...",
  "Použít polohu",
  "Dobré k letu",
  "Hraniční podmínky",
  "Nelétej",
);

export const sk = pack(
  "sk",
  "Slovenčina",
  "Slovak",
  "GlideWeather · Letové počasie",
  "Verdikt štartu pre paragliding: vietor, nárazy, dohľadnosť a nestabilita.",
  "Letové okno paraglidingu",
  "Hyperlokálne letové info pre paragliding, na jedno kliknutie.",
  "Hľadaj štart alebo miesto...",
  "Použiť polohu",
  "Dobré na let",
  "Hraničné podmienky",
  "Nelietaj",
);

export const sl = pack(
  "sl",
  "Slovenščina",
  "Slovenian",
  "GlideWeather · Letalno vreme",
  "Razsodba vzleta za jadralno padalstvo: veter, sunki, vidljivost in nestabilnost.",
  "Letalno okno jadralnega padalstva",
  "Hiperlokalne letalne informacije za pilote, en klik stran.",
  "Išči vzletišče ali kraj...",
  "Uporabi lokacijo",
  "Dobro za let",
  "Mejne razmere",
  "Ne leti",
);

export const nl = pack(
  "nl",
  "Nederlands",
  "Dutch",
  "GlideWeather · Vliegweer",
  "Startoordeel voor paragliding: wind, vlagen, zicht en instabiliteit.",
  "Paragliding-vluchtvenster",
  "Hyperlokale vluchtinfo voor paragliders, één klik verder.",
  "Zoek een start of plaats...",
  "Gebruik mijn locatie",
  "Goed om te vliegen",
  "Marginale omstandigheden",
  "Niet vliegen",
);

export const mt = pack(
  "mt",
  "Malti",
  "Maltese",
  "GlideWeather · Temp tat-titjira",
  "Verdett tat-tlugħ għall-paragliding: riħ, buffuri, viżibilità u instabbiltà.",
  "Tieqa tat-titjira tal-paragliding",
  "Informazzjoni iperlokali tat-titjira għall-piloti, klikk bogħod.",
  "Fittex tlugħ jew lokalità...",
  "Uża l-post tiegħi",
  "Tajjeb biex ttir",
  "Kundizzjonijiet marġinali",
  "Titirx",
);

export const tr = pack(
  "tr",
  "Türkçe",
  "Turkish",
  "GlideWeather · Uçuş havası",
  "Yamaç paraşütü kalkış kararı: rüzgar, hamle, görüş ve kararsızlık.",
  "Yamaç paraşütü uçuş penceresi",
  "Pilotlar için hiper yerel uçuş bilgisi, bir tık uzağında.",
  "Kalkış veya yer ara...",
  "Konumumu kullan",
  "Uçmak için iyi",
  "Sınırda koşullar",
  "Uçma",
);

export const hr = pack(
  "hr",
  "Hrvatski",
  "Croatian",
  "GlideWeather · Vrijeme za let",
  "Ocjena starta za parajedrilicu: vjetar, udari, vidljivost i nestabilnost.",
  "Prozor letenja parajedrilice",
  "Hiperlokalne letne informacije za pilote, na jedan klik.",
  "Traži start ili mjesto...",
  "Koristi moju lokaciju",
  "Dobro za let",
  "Granični uvjeti",
  "Ne leti",
);

export const sr = pack(
  "sr",
  "Srpski",
  "Serbian",
  "GlideWeather · Vreme za let",
  "Ocena starta za paraglajding: vetar, udari, vidljivost i nestabilnost.",
  "Prozor letenja paraglajdinga",
  "Hiperlokalne letne informacije za pilote, na jedan klik.",
  "Traži start ili mesto...",
  "Koristi moju lokaciju",
  "Dobro za let",
  "Granični uslovi",
  "Ne leti",
);

export const sq = pack(
  "sq",
  "Shqip",
  "Albanian",
  "GlideWeather · Moti i fluturimit",
  "Verdikt nisjeje për paragliding: erë, goditje, dukshmëri dhe paqëndrueshmëri.",
  "Dritarja e fluturimit paragliding",
  "Informacion hiperlokal fluturimi për pilotët, një klikim larg.",
  "Kërko një nisje ose vend...",
  "Përdor vendndodhjen time",
  "Mirë për të fluturuar",
  "Kushte kufitare",
  "Mos fluturo",
);
