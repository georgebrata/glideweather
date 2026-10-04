import { contentLocaleDefinition, type ContentLocale, type CopyLocale } from "../../content-locales";
import { extraGuides } from "./extraGuides";
import { moreGuides } from "./moreGuides";
import { restGuides } from "./restGuides";
import type { GuideRouteKey } from "../seo/types";

export type GuideSection = {
  id: string;
  heading: string;
  paragraphs: readonly string[];
};

export type GuideContent = {
  h1: string;
  lead: string;
  sections: readonly GuideSection[];
  related: readonly GuideRouteKey[];
};

const en = {
  lastUpdatedLabel: "Last updated",
  disclaimer:
    "Decision aid, not flight authorization. Confirm the real wind at launch, rotor, convective development, area rules, and your own pilot limits.",
  about: {
    h1: "About GlideWeather",
    lead:
      "GlideWeather is a hyperlocal weather console built for paraglider pilots who need wind, gust, visibility, and instability signals in one place before travelling to a launch site.",
    sections: [
      {
        id: "problem",
        heading: "What problem it solves",
        paragraphs: [
          "General weather apps show forecasts, but they rarely express how those numbers relate to conservative paragliding limits. GlideWeather normalizes forecast data and applies the same scoring rules everywhere you search.",
          "The goal is faster briefing: compare sites, watch changing wind, and open a ranked view of daylight hours without replacing your own site knowledge.",
        ],
      },
      {
        id: "who",
        heading: "Who it is for",
        paragraphs: [
          "Sport and recreational paraglider pilots who already understand local sites, airspace, and personal limits.",
          "Instructors and students can use it as a structured starting point, but it does not replace supervised instruction or club briefings.",
        ],
      },
      {
        id: "different",
        heading: "What makes it different",
        paragraphs: [
          "GlideWeather combines Meteoblue forecast packages (when configured on the server) with Open-Meteo as automatic fallback, plus Open-Meteo air quality and geocoding.",
          "Instead of dozens of raw fields, you get a 0–100 flight confidence score, a GO / WAIT / NO style ring, explicit reasons, and launch-window hints derived from the same rules.",
        ],
      },
      {
        id: "limits",
        heading: "What it does not claim",
        paragraphs: [
          "GlideWeather does not authorize flight, certify airworthiness, or replace official notices. Popularity of a destination page does not mean conditions are favorable on a given day.",
        ],
      },
    ],
    related: ["howItWorks", "flightWindow", "faq"] as GuideRouteKey[],
  },
  howItWorks: {
    h1: "How GlideWeather works",
    lead:
      "From coordinates to a launch-oriented verdict: location, forecast ingestion, flying-condition signals, and flight-window interpretation.",
    sections: [
      {
        id: "flow",
        heading: "The flow",
        paragraphs: [
          "You pick a launch area via search, map pin, browser GPS, or a saved default location when signed in.",
          "The server requests a normalized forecast snapshot for those coordinates (primary Meteoblue, fallback Open-Meteo). Results are cached briefly to reduce load.",
          "Each hourly sample is evaluated with the same conservative rules for wind, gusts, gust spread, precipitation, visibility, instability (CAPE), and several optional Meteoblue fields when present.",
        ],
      },
      {
        id: "output",
        heading: "What you see",
        paragraphs: [
          "The main panel shows current wind, gusts, estimated cloud base, visibility, and the next six hours as a simple trend.",
          "The forecast drawer adds day tabs, gust spread, rain probability, CAPE, and up to four ranked daylight hours that are not classified as no-go.",
        ],
      },
      {
        id: "data",
        heading: "Data sources",
        paragraphs: [
          "Forecast: Meteoblue basic/wind/cloud/air packages when an API key is set; otherwise Open-Meteo.",
          "Air quality and UV: Open-Meteo air-quality API alongside either forecast provider.",
          "Place names: Open-Meteo geocoding from the browser when you search.",
        ],
      },
    ],
    related: ["paraglidingWeather", "flightWindow", "whenToFly"] as GuideRouteKey[],
  },
  paraglidingWeather: {
    h1: "Understanding paragliding weather in GlideWeather",
    lead:
      "GlideWeather only explains metrics it actually loads. Below is how those fields relate to the launch verdict.",
    sections: [
      {
        id: "wind",
        heading: "Wind and gusts at 10 m",
        paragraphs: [
          "Surface wind speed and direction come from model levels near 10 m. The scoring treats very light wind, strong wind, missing gust data, high gusts, and large gust-minus-wind spread as risk signals.",
          "The interface also shows an 80 m wind field when the provider supplies it, mainly as extra context in the detailed drawer.",
        ],
      },
      {
        id: "visibility",
        heading: "Visibility and weather codes",
        paragraphs: [
          "Visibility below about 10 km triggers caution; below 5 km is treated as no-go in the automated rules.",
          "WMO weather codes drive thunderstorm and precipitation wording when radar-like detail is unavailable.",
        ],
      },
      {
        id: "precip",
        heading: "Precipitation and rain probability",
        paragraphs: [
          "Measured precipitation amount and rain probability both influence the score. Snow fraction can escalate the precip reason when high.",
        ],
      },
      {
        id: "instability",
        heading: "Instability and clouds",
        paragraphs: [
          "CAPE above conservative thresholds adds caution or no-go reasons. High total or low cloud cover can reduce the score modestly.",
          "Cloud base on the main panel is estimated from temperature and humidity—not a direct model cloud-base product.",
        ],
      },
      {
        id: "air",
        heading: "Air quality and UV",
        paragraphs: [
          "US AQI and high UV index can subtract points when present. These are supporting signals, not primary launch drivers.",
        ],
      },
    ],
    related: ["flightWindow", "whenToFly", "faq"] as GuideRouteKey[],
  },
  whenToFly: {
    h1: "When to use GlideWeather",
    lead:
      "Practical moments to open the console—without treating any green indicator as permission to launch.",
    sections: [
      {
        id: "travel",
        heading: "Before you travel",
        paragraphs: [
          "Compare wind and gust trends between candidate launch sites when planning a weekend or road trip.",
          "Read destination overview pages for context, then open the forecast for reference coordinates—not as a guarantee for the exact launch hour.",
        ],
      },
      {
        id: "day",
        heading: "On a flying day",
        paragraphs: [
          "Check the score and reasons before rigging up, then again if clouds build or wind shifts.",
          "Use the favorable-until line as a model-based hint; verify with anemometers, flags, and local pilots.",
        ],
      },
      {
        id: "monitor",
        heading: "While conditions change",
        paragraphs: [
          "Refresh or re-open the forecast drawer to see if ranked daylight hours move as new model runs arrive (cached for about 20 minutes on the server).",
        ],
      },
    ],
    related: ["howItWorks", "destinationsHub", "faq"] as GuideRouteKey[],
  },
  flightWindow: {
    h1: "What is a paragliding flight window?",
    lead:
      "In GlideWeather, “flight window” refers to three related ideas: the score, the timing line, and ranked daylight hours.",
    sections: [
      {
        id: "score",
        heading: "Flight confidence score",
        paragraphs: [
          "Each weather sample starts at 100 points. Hard limits (for example night, extreme wind, thunderstorms) force a no-go status and cap the score.",
          "Caution reasons or a score below the good threshold produce a marginal status. Otherwise the status is good.",
        ],
      },
      {
        id: "until",
        heading: "Favorable until…",
        paragraphs: [
          "The app walks forward through today’s hourly samples and finds how long the same status persists. If conditions already changed, you see a brief “now” message instead.",
        ],
      },
      {
        id: "ranked",
        heading: "Ranked daylight hours",
        paragraphs: [
          "In the forecast drawer, daylight hours are sorted by score. Up to four non–no-go hours are listed as launch-window candidates.",
          "They are independent hours, not a continuous block. Empty state means no daylight hour passed the conservative filters.",
        ],
      },
      {
        id: "chart",
        heading: "Next six hours chart",
        paragraphs: [
          "Bar colors mark hours that are good and not worsening versus the previous slot by more than about 3 km/h of wind. That is a visual hint, not a separate forecast product.",
        ],
      },
    ],
    related: ["paraglidingWeather", "howItWorks", "faq"] as GuideRouteKey[],
  },
  faq: {
    h1: "Paragliding weather FAQ",
    lead: "Direct answers aligned with how GlideWeather behaves today.",
    sections: [],
    related: ["about", "flightWindow", "paraglidingWeather"] as GuideRouteKey[],
  },
  faqItems: [
    {
      question: "What is a paragliding flight window?",
      answer:
        "In GlideWeather it is the combination of the 0–100 flight confidence score, the “favorable until” timing for the current status, and up to four ranked daylight hours that are not classified as no-go in the forecast drawer.",
    },
    {
      question: "How do I check weather before paragliding?",
      answer:
        "Search your launch area or open a destination link, review wind, gusts, visibility, and reasons on the main panel, then open the full forecast for hourly detail and ranked hours.",
    },
    {
      question: "What wind conditions does GlideWeather use?",
      answer:
        "The automated rules apply conservative thresholds to 10 m wind and gusts, including gust-minus-wind spread. They are filters for briefing, not universal legal limits for every wing or site.",
    },
    {
      question: "Can GlideWeather tell me whether it is safe to fly?",
      answer:
        "No. It is a decision aid. Only you, with local knowledge and applicable rules, can decide whether to launch.",
    },
    {
      question: "Can I use GlideWeather for different launch sites?",
      answer:
        "Yes. Search worldwide via Open-Meteo geocoding, drag the map pin, use GPS, or follow curated destination pages that deep-link into the console.",
    },
    {
      question: "How accurate is the forecast?",
      answer:
        "Accuracy depends on the underlying models (Meteoblue or Open-Meteo). GlideWeather caches responses briefly and may show a low predictability note when Meteoblue confidence is under 30% for a day.",
    },
    {
      question: "What weather data does GlideWeather use?",
      answer:
        "Meteoblue forecast packages when configured server-side, otherwise Open-Meteo forecast; Open-Meteo for air quality; Open-Meteo geocoding for place search.",
    },
  ],
  homeIntro: {
    heading: "Paragliding weather intelligence",
    paragraphs: [
      "GlideWeather turns hyperlocal forecast data into a single flight confidence score with explicit reasons—wind, gust spread, visibility, precipitation, and instability signals pilots already watch.",
      "Use the guides below to understand how scoring works, when to check conditions, and how destination pages link into the live console.",
    ],
  },
  destinationsHub: {
    h1: "Popular paragliding destinations",
    lead:
      "Curated flying areas for discovery and briefing. Listing a site does not mean conditions are flyable today.",
    sections: [
      {
        id: "use",
        heading: "How to use this list",
        paragraphs: [
          "Each page describes why pilots fly there, typical seasonality, and reference coordinates for forecasts.",
          "Follow “Open forecast” to load the console at that point. Forecast URLs with ?site= are application state and are not indexed as separate pages.",
        ],
      },
    ],
    related: ["whenToFly", "paraglidingWeather", "about"] as GuideRouteKey[],
  },
} as const;

const roFull = {
  lastUpdatedLabel: "Ultima actualizare",
  disclaimer:
    "Ajutor la decizie, nu autorizare de zbor. Confirmă vântul real la decolare, rotorul, dezvoltarea convectivă, regulile zonei și limitele tale de pilot.",
  about: {
    h1: "Despre GlideWeather",
    lead:
      "GlideWeather este o consolă meteo hiperlocală pentru piloți de parapantă care au nevoie de vânt, rafale, vizibilitate și instabilitate într-un singur loc înainte de drumul la decolare.",
    sections: [
      {
        id: "problem",
        heading: "Ce problemă rezolvă",
        paragraphs: [
          "Aplicațiile meteo generale arată prognoze, dar rareori explică cum se raportează la limite conservatoare de parapantă. GlideWeather normalizează datele și aplică aceleași reguli oriunde cauți.",
          "Scopul este un briefing mai rapid: compară site-uri, urmărește vântul și deschide orele de zi clasificate, fără a înlocui cunoașterea locală.",
        ],
      },
      {
        id: "who",
        heading: "Pentru cine este",
        paragraphs: [
          "Piloți sportivi și recreaționali care înțeleg deja site-urile, spațiul aerian și limitele personale.",
          "Instructorii și cursanții o pot folosi ca punct de plecare structurat, dar nu înlocuiește instruirea supravegheată sau briefingurile clubului.",
        ],
      },
      {
        id: "different",
        heading: "Ce îl face diferit",
        paragraphs: [
          "GlideWeather combină pachete Meteoblue (când sunt configurate pe server) cu Open-Meteo ca fallback automat, plus calitatea aerului și geocodare Open-Meteo.",
          "În loc de zeci de câmpuri brute, primești un scor 0–100, inel GO / WAIT / NO, motive explicite și indicii de fereastră de zbor din aceleași reguli.",
        ],
      },
      {
        id: "limits",
        heading: "Ce nu pretinde",
        paragraphs: [
          "GlideWeather nu autorizează zborul, nu certifică aeronavegabilitatea și nu înlocuiește informările oficiale. Popularitatea unei destinații nu înseamnă condiții favorabile într-o zi anume.",
        ],
      },
    ],
    related: ["howItWorks", "flightWindow", "faq"] as GuideRouteKey[],
  },
  howItWorks: {
    h1: "Cum funcționează GlideWeather",
    lead:
      "De la coordonate la un verdict orientat spre decolare: locație, prognoză, semnale de zbor și interpretarea ferestrei de zbor.",
    sections: [
      {
        id: "flow",
        heading: "Fluxul",
        paragraphs: [
          "Alegi o zonă prin căutare, pin pe hartă, GPS sau locație implicită salvată când ești autentificat.",
          "Serverul cere un snapshot de prognoză normalizat (Meteoblue principal, Open-Meteo fallback), cu cache scurt.",
          "Fiecare eșantion orar este evaluat cu aceleași reguli conservatoare pentru vânt, rafale, diferență de rafale, precipitații, vizibilitate, CAPE și câmpuri opționale Meteoblue.",
        ],
      },
      {
        id: "output",
        heading: "Ce vezi",
        paragraphs: [
          "Panoul principal arată vântul, rafalele, baza de nori estimată, vizibilitatea și următoarele șase ore ca trend simplu.",
          "Sertarul de prognoză adaugă zile, diferența de rafale, probabilitatea de ploaie, CAPE și până la patru ore de zi care nu sunt no-go.",
        ],
      },
      {
        id: "data",
        heading: "Surse de date",
        paragraphs: [
          "Prognoză: pachete Meteoblue când există cheie API; altfel Open-Meteo.",
          "Calitate aer și UV: API Open-Meteo alături de orice furnizor de prognoză.",
          "Nume locuri: geocodare Open-Meteo din browser la căutare.",
        ],
      },
    ],
    related: ["paraglidingWeather", "flightWindow", "whenToFly"] as GuideRouteKey[],
  },
  paraglidingWeather: {
    h1: "Meteo parapantă în GlideWeather",
    lead:
      "GlideWeather explică doar metricile pe care le încarcă efectiv. Iată cum se leagă de verdictul de decolare.",
    sections: [
      {
        id: "wind",
        heading: "Vânt și rafale la 10 m",
        paragraphs: [
          "Vântul la suprafață vine de la niveluri model de circa 10 m. Scorul tratează vânt foarte slab, vânt puternic, lipsa rafalelor, rafale mari și diferența mare rafale–vânt ca semnale de risc.",
        ],
      },
      {
        id: "visibility",
        heading: "Vizibilitate și coduri meteo",
        paragraphs: [
          "Vizibilitatea sub circa 10 km aduce atenționare; sub 5 km este tratată ca no-go în regulile automate.",
          "Codurile WMO alimentează textul pentru furtuni și precipitații când nu există radar.",
        ],
      },
      {
        id: "precip",
        heading: "Precipitații",
        paragraphs: [
          "Cantitatea măsurată și probabilitatea de ploaie influențează scorul. Fracția de zăpadă poate intensifica motivul de precipitații.",
        ],
      },
      {
        id: "instability",
        heading: "Instabilitate și nori",
        paragraphs: [
          "CAPE peste praguri conservatoare adaugă atenționări sau no-go. Nori totali sau joși foarte mari pot reduce modest scorul.",
          "Baza de nori pe panoul principal este estimată din temperatură și umiditate.",
        ],
      },
      {
        id: "air",
        heading: "Calitate aer și UV",
        paragraphs: [
          "US AQI și UV ridicat pot scădea puncte. Sunt semnale secundare, nu factori principali de decolare.",
        ],
      },
    ],
    related: ["flightWindow", "whenToFly", "faq"] as GuideRouteKey[],
  },
  whenToFly: {
    h1: "Când să folosești GlideWeather",
    lead:
      "Momente practice pentru consolă—fără a trata niciun indicator verde ca permisiune de lansare.",
    sections: [
      {
        id: "travel",
        heading: "Înainte de drum",
        paragraphs: [
          "Compară tendințele de vânt între site-uri candidate când planifici un weekend.",
          "Citește paginile destinațiilor pentru context, apoi deschide prognoza pentru coordonatele de referință.",
        ],
      },
      {
        id: "day",
        heading: "În ziua de zbor",
        paragraphs: [
          "Verifică scorul și motivele înainte de montare, apoi din nou dacă se schimbă vântul sau norii.",
          "Folosește linia „favorabil până la” ca indiciu de model; validează cu anemometre și piloți locali.",
        ],
      },
      {
        id: "monitor",
        heading: "Când se schimbă vremea",
        paragraphs: [
          "Reîmprospătează prognoza pentru a vedea cum se mută orele clasificate (cache server circa 20 minute).",
        ],
      },
    ],
    related: ["howItWorks", "destinationsHub", "faq"] as GuideRouteKey[],
  },
  flightWindow: {
    h1: "Ce este fereastra de zbor parapantă?",
    lead:
      "În GlideWeather, „fereastra de zbor” cuprinde scorul, linia de timp și orele de zi clasificate.",
    sections: [
      {
        id: "score",
        heading: "Scorul de încredere",
        paragraphs: [
          "Fiecare eșantion începe de la 100. Limite dure (noapte, vânt extrem, furtuni) forțează no-go și plafonarea scorului.",
          "Atenționările sau un scor sub pragul „bun” produc status marginal. Altfel status bun.",
        ],
      },
      {
        id: "until",
        heading: "Favorabil până la…",
        paragraphs: [
          "Aplicația parcurge orele de azi și găsește cât timp persistă același status.",
        ],
      },
      {
        id: "ranked",
        heading: "Ore de zi clasificate",
        paragraphs: [
          "În prognoză, orele de zi sunt sortate după scor. Până la patru ore non–no-go apar ca candidați.",
          "Sunt ore independente, nu un bloc continuu.",
        ],
      },
      {
        id: "chart",
        heading: "Graficul următoarelor șase ore",
        paragraphs: [
          "Culorile marchează ore bune fără creștere de vânt de peste circa 3 km/h față de slotul anterior—indiciu vizual, nu produs separat.",
        ],
      },
    ],
    related: ["paraglidingWeather", "howItWorks", "faq"] as GuideRouteKey[],
  },
  faq: {
    h1: "Întrebări frecvente meteo parapantă",
    lead: "Răspunsuri aliniate cu comportamentul actual al GlideWeather.",
    sections: [],
    related: ["about", "flightWindow", "paraglidingWeather"] as GuideRouteKey[],
  },
  faqItems: [
    {
      question: "Ce este fereastra de zbor parapantă?",
      answer:
        "În GlideWeather este combinația scorului 0–100, timingului „favorabil până la” și până la patru ore de zi care nu sunt no-go în prognoză.",
    },
    {
      question: "Cum verific vremea înainte de parapantă?",
      answer:
        "Caută zona de decolare sau deschide o destinație, citește vântul, rafalele, vizibilitatea și motivele, apoi prognoza completă.",
    },
    {
      question: "Ce condiții de vânt folosește GlideWeather?",
      answer:
        "Reguli automate conservatoare la vânt și rafale la 10 m, inclusiv diferența rafale–vânt. Sunt filtre de briefing, nu limite legale universale.",
    },
    {
      question: "Poate GlideWeather să spună dacă este sigur să zbor?",
      answer:
        "Nu. Este ajutor la decizie. Doar tu, cu cunoaștere locală și reguli aplicabile, poți decide lansarea.",
    },
    {
      question: "Pot folosi GlideWeather pentru site-uri diferite?",
      answer:
        "Da. Caută global, mută pinul pe hartă, folosește GPS sau linkuri de destinație care deschid consola.",
    },
    {
      question: "Cât de precisă este prognoza?",
      answer:
        "Depinde de modelele Meteoblue sau Open-Meteo. GlideWeather cache-uiește răspunsuri și poate arăta predictibilitate scăzută sub 30% pe zi.",
    },
    {
      question: "Ce date meteo folosește GlideWeather?",
      answer:
        "Meteoblue când este configurat pe server, altfel Open-Meteo; calitate aer Open-Meteo; geocodare Open-Meteo pentru căutare.",
    },
  ],
  homeIntro: {
    heading: "Inteligență meteo pentru parapantă",
    paragraphs: [
      "GlideWeather transformă prognoza hiperlocală într-un scor de încredere cu motive explicite—vânt, rafale, vizibilitate, precipitații și instabilitate.",
      "Ghidurile explică scorul, momentul verificării și cum destinațiile deschid consola live.",
    ],
  },
  destinationsHub: {
    h1: "Destinații populare parapantă",
    lead:
      "Zone de zbor pentru descoperire și briefing. Listarea unui site nu înseamnă condiții zborabile azi.",
    sections: [
      {
        id: "use",
        heading: "Cum folosești lista",
        paragraphs: [
          "Fiecare pagină descrie contextul, sezonalitatea și coordonatele de referință.",
          "„Deschide prognoza” încarcă consola. URL-urile cu ?site= sunt stare de aplicație, fără indexare separată.",
        ],
      },
    ],
    related: ["whenToFly", "paraglidingWeather", "about"] as GuideRouteKey[],
  },
};

export type GuideCopyBundle = {
  lastUpdatedLabel: string;
  disclaimer: string;
  about: GuideContent;
  howItWorks: GuideContent;
  paraglidingWeather: GuideContent;
  whenToFly: GuideContent;
  flightWindow: GuideContent;
  faq: GuideContent;
  faqItems: readonly { question: string; answer: string }[];
  homeIntro: { heading: string; paragraphs: readonly string[] };
  destinationsHub: GuideContent;
};

const bundles: Partial<Record<CopyLocale, GuideCopyBundle>> = {
  en,
  ro: roFull,
  ...extraGuides,
  ...moreGuides,
  ...restGuides,
};

export function getGuideCopy(locale: ContentLocale): GuideCopyBundle {
  const copy = contentLocaleDefinition(locale).copy;
  return bundles[copy] ?? en;
}

export function getGuideContent(locale: ContentLocale, key: GuideRouteKey): GuideContent {
  const copy = getGuideCopy(locale);
  if (key === "destinationsHub") return copy.destinationsHub;
  if (key === "faq") return copy.faq;
  if (key === "home") return copy.about;
  return copy[key];
}

export const CONTENT_LAST_UPDATED = "2026-04-04";
