import type { ContentLocale } from "../seo/types";

export type DestinationRegion =
  | "europe"
  | "asia"
  | "africa"
  | "oceania"
  | "northAmerica"
  | "southAmerica"
  | "romania";

export type DestinationRecord = {
  id: string;
  slug: string;
  region: DestinationRegion;
  countryCode: string;
  latitude: number;
  longitude: number;
  names: Record<ContentLocale, string>;
  areas: Record<ContentLocale, string>;
  shortDescriptions: Record<ContentLocale, string>;
  overviews: Record<ContentLocale, string>;
  flyingContext: Record<ContentLocale, string>;
  seasonality: Record<ContentLocale, string>;
  referenceUrl?: string;
};

const destination = (
  partial: Omit<
    DestinationRecord,
    "names" | "areas" | "shortDescriptions" | "overviews" | "flyingContext" | "seasonality"
  > & {
    names: Record<ContentLocale, string>;
    areas: Record<ContentLocale, string>;
    shortDescriptions: Record<ContentLocale, string>;
    overviews: Record<ContentLocale, string>;
    flyingContext: Record<ContentLocale, string>;
    seasonality: Record<ContentLocale, string>;
  },
): DestinationRecord => partial;

export const DESTINATIONS: DestinationRecord[] = [
  destination({
    id: "annecy",
    slug: "annecy",
    region: "europe",
    countryCode: "FR",
    latitude: 45.8992,
    longitude: 6.1294,
    names: { en: "Annecy", ro: "Annecy" },
    areas: { en: "Haute-Savoie, France", ro: "Haute-Savoie, Franța" },
    shortDescriptions: {
      en: "Alpine lake flying with strong valley wind awareness.",
      ro: "Zbor alpine pe lac, cu atenție la vântul de vale.",
    },
    overviews: {
      en:
        "Annecy is one of Europe’s best-known free-flight areas, with launches above Lac d’Annecy and cross-country potential when thermals and airspace allow.",
      ro:
        "Annecy este una dintre cele mai cunoscute zone de zbor liber din Europa, cu decolări deasupra lacului și potențial XC când termica și spațiul aerian permit.",
    },
    flyingContext: {
      en:
        "Pilots watch valley breeze, alpine gusts, and afternoon convection. GlideWeather reads 10 m wind and gust spread at your chosen coordinates—confirm rotor and local rules on site.",
      ro:
        "Piloții urmăresc briza de vale, rafalele alpine și convecția de după-amiază. GlideWeather citește vântul la 10 m și diferența de rafale la coordonatele alese—confirmă rotorul și regulile locale la fața locului.",
    },
    seasonality: {
      en: "Most activity spring through autumn; winter is cold and often snow-limited.",
      ro: "Activitate maximă primăvara–toamna; iarna este rece și adesea limitată de zăpadă.",
    },
    referenceUrl: "https://www.ffvl.fr/",
  }),
  destination({
    id: "interlaken",
    slug: "interlaken",
    region: "europe",
    countryCode: "CH",
    latitude: 46.6863,
    longitude: 7.8632,
    names: { en: "Interlaken", ro: "Interlaken" },
    areas: { en: "Bernese Oberland, Switzerland", ro: "Oberland bernese, Elveția" },
    shortDescriptions: {
      en: "Classic Swiss alpine sites with dramatic terrain.",
      ro: "Site-uri alpine elvețiene clasice, relief dramatic.",
    },
    overviews: {
      en:
        "The Interlaken region gathers multiple iconic launches around the Jungfrau massif, drawing pilots for scenic ridge and thermal flying when weather cooperates.",
      ro:
        "Regiunea Interlaken adună mai multe decolări emblematice în jurul masivului Jungfrau, atrăgând piloți pentru zbor de coastă și termică când vremea permite.",
    },
    flyingContext: {
      en:
        "Terrain channels wind quickly. Use GlideWeather for baseline wind, gusts, and visibility, then validate valley flow and cable-car operations locally.",
      ro:
        "Relieful canalizează rapid vântul. Folosește GlideWeather pentru vânt, rafale și vizibilitate de bază, apoi validează fluxul de vale și operațiunile locale.",
    },
    seasonality: {
      en: "Summer is busiest; spring and autumn can offer calmer windows with cold air aloft.",
      ro: "Vara este cel mai aglomerat; primăvara și toamna pot oferi ferestre mai calme.",
    },
  }),
  destination({
    id: "bassano",
    slug: "bassano-del-grappa",
    region: "europe",
    countryCode: "IT",
    latitude: 45.8756,
    longitude: 11.7444,
    names: { en: "Bassano del Grappa", ro: "Bassano del Grappa" },
    areas: { en: "Veneto, Italy", ro: "Veneto, Italia" },
    shortDescriptions: {
      en: "Historic Italian ridge flying above the Piave valley.",
      ro: "Zbor clasic pe coastă deasupra văii Piave.",
    },
    overviews: {
      en:
        "Monte Grappa and the surrounding hills are a long-standing paragliding hub in northern Italy, popular for ridge soaring and training flights.",
      ro:
        "Monte Grappa și dealurile din jur formează un pol istoric de parapantă în nordul Italiei, popular pentru coastă și zboruri de instruire.",
    },
    flyingContext: {
      en:
        "Afternoon sea-breeze penetration and alpine outflow can change quickly. GlideWeather highlights wind speed, gust spread, and CAPE-style instability signals at your reference point.",
      ro:
        "Penetrarea breezei de mare și fluxul alpine se pot schimba rapid. GlideWeather evidențiază vântul, rafalele și semnalele de instabilitate la punctul de referință.",
    },
    seasonality: {
      en: "Flyable much of the year with spring and autumn often favored for smoother conditions.",
      ro: "Zbor posibil mare parte din an; primăvara și toamna sunt adesea preferate.",
    },
  }),
  destination({
    id: "oludeniz",
    slug: "oludeniz",
    region: "europe",
    countryCode: "TR",
    latitude: 36.5494,
    longitude: 29.115,
    names: { en: "Ölüdeniz · Babadağ", ro: "Ölüdeniz · Babadağ" },
    areas: { en: "Muğla, Türkiye", ro: "Muğla, Turcia" },
    shortDescriptions: {
      en: "Turquoise coast flying from Babadağ launches.",
      ro: "Zbor pe coasta turcoaz de pe Babadağ.",
    },
    overviews: {
      en:
        "Babadağ above Ölüdeniz is a world-famous coastal site where pilots launch toward the lagoon and beach landing zones under regulated operations.",
      ro:
        "Babadağ deasupra Ölüdeniz este un site costier celebru, cu decolări spre lagună și zone de aterizare reglementate.",
    },
    flyingContext: {
      en:
        "Sea breeze and mid-day thermals matter. Check GlideWeather for wind direction, gusts, and visibility before travelling; onsite briefings remain essential.",
      ro:
        "Briza mării și termica de la prânz contează. Verifică în GlideWeather direcția vântului, rafalele și vizibilitatea înainte de drum; briefingul local rămâne esențial.",
    },
    seasonality: {
      en: "Peak season April–October; midday heat can raise turbulence and instability.",
      ro: "Sezon de vârf aprilie–octombrie; căldura de la prânz poate crește turbulența.",
    },
  }),
  destination({
    id: "pokhara",
    slug: "pokhara",
    region: "asia",
    countryCode: "NP",
    latitude: 28.2096,
    longitude: 83.9856,
    names: { en: "Pokhara", ro: "Pokhara" },
    areas: { en: "Gandaki, Nepal", ro: "Gandaki, Nepal" },
    shortDescriptions: {
      en: "Himalayan foothill flying with monsoon awareness.",
      ro: "Zbor în prealpi, cu atenție la monsoon.",
    },
    overviews: {
      en:
        "Sarangkot and nearby ridges above Pokhara offer iconic views of the Annapurna range and are a major destination for tandem and XC-oriented pilots in season.",
      ro:
        "Sarangkot și crestele de deasupra Pokharei oferă priveliști iconice spre Annapurna și atrag piloți pentru tandem și XC în sezon.",
    },
    flyingContext: {
      en:
        "Monsoon clouds, valley wind, and rapid weather changes demand conservative planning. GlideWeather helps compare hourly wind, rain probability, and visibility at your grid point.",
      ro:
        "Norii de monsoon, vântul de vale și schimbările rapide cer planificare conservatoare. GlideWeather ajută la compararea vântului orar, probabilității de ploaie și vizibilității.",
    },
    seasonality: {
      en: "Post-monsoon autumn and spring are common flying seasons; summer monsoon is typically unfavorable.",
      ro: "Toamna după monsoon și primăvara sunt sezoane frecvente; monsoonul de vară este de obicei nefavorabil.",
    },
  }),
  destination({
    id: "bir-billing",
    slug: "bir-billing",
    region: "asia",
    countryCode: "IN",
    latitude: 32.0442,
    longitude: 76.7189,
    names: { en: "Bir Billing", ro: "Bir Billing" },
    areas: { en: "Himachal Pradesh, India", ro: "Himachal Pradesh, India" },
    shortDescriptions: {
      en: "High-altitude Himalayan site known for XC potential.",
      ro: "Site himalayan la altitudine, cunoscut pentru XC.",
    },
    overviews: {
      en:
        "Billing launch above Bir is among the best-known paragliding sites in India, hosting competitions and XC camps when synoptic patterns support ridge and thermal flying.",
      ro:
        "Decolarea Billing deasupra Bir este printre cele mai cunoscute site-uri din India, cu competiții și tabere XC când vremea permite.",
    },
    flyingContext: {
      en:
        "Elevation and valley inversions affect usable windows. Use GlideWeather for wind/gust trends and instability hints, then respect local instructor guidance.",
      ro:
        "Altitudinea și inversiile de vale influențează ferestrele utilizabile. Folosește GlideWeather pentru tendințe de vânt/rafale, apoi respectă ghidarea locală.",
    },
    seasonality: {
      en: "October–November and March–May are typical main seasons; winter snow can limit access.",
      ro: "Octombrie–noiembrie și martie–mai sunt sezoane tipice; zăpada de iarnă poate limita accesul.",
    },
  }),
  destination({
    id: "cape-town",
    slug: "cape-town",
    region: "africa",
    countryCode: "ZA",
    latitude: -33.95,
    longitude: 18.4,
    names: { en: "Cape Town", ro: "Cape Town" },
    areas: { en: "Western Cape, South Africa", ro: "Western Cape, Africa de Sud" },
    shortDescriptions: {
      en: "Coastal and mountain flying near Table Mountain.",
      ro: "Zbor costier și montan lângă Table Mountain.",
    },
    overviews: {
      en:
        "The Cape Peninsula combines scenic ridge sites with strong maritime winds; Lion’s Head and surrounding hills are well known in the free-flight community.",
      ro:
        "Peninsula Capului combină site-uri de coastă cu vânt marin puternic; Lion’s Head și dealurile din jur sunt cunoscute în comunitatea de zbor liber.",
    },
    flyingContext: {
      en:
        "Cape Doctor south-easterlies can strengthen quickly. GlideWeather surfaces gust spread and visibility; always cross-check marine forecasts and site-specific wind limits.",
      ro:
        "South-easterly „Cape Doctor” se poate intensifica rapid. GlideWeather arată diferența de rafale și vizibilitatea; verifică și prognozele marine și limitele locale.",
    },
    seasonality: {
      en: "Summer brings strong winds; calmer windows often appear in shoulder seasons with careful timing.",
      ro: "Vara aduce vânt puternic; ferestre mai calme apar adesea în sezoanele intermediare.",
    },
  }),
  destination({
    id: "queenstown",
    slug: "queenstown",
    region: "oceania",
    countryCode: "NZ",
    latitude: -44.9167,
    longitude: 168.6626,
    names: { en: "Queenstown", ro: "Queenstown" },
    areas: { en: "Otago, New Zealand", ro: "Otago, Noua Zeelandă" },
    shortDescriptions: {
      en: "Southern Alps scenic flying with fast weather shifts.",
      ro: "Zbor scenic în Alpii Sudici, vreme schimbătoare.",
    },
    overviews: {
      en:
        "Queenstown and nearby Wanaka draws pilots for alpine scenery and structured flying operations, with multiple managed launch areas in the region.",
      ro:
        "Queenstown și Wanaka atrag piloți pentru peisaj alpine și operațiuni structurate, cu mai multe zone de decolare gestionate.",
    },
    flyingContext: {
      en:
        "Föhn-like winds and frontal passages can change scores within hours. Monitor GlideWeather hourly wind, precipitation probability, and CAPE-related cautions.",
      ro:
        "Vânturi tip föhn și fronturi pot schimba scorul în câteva ore. Monitorizează vântul orar, probabilitatea de ploaie și atenționările legate de CAPE în GlideWeather.",
    },
    seasonality: {
      en: "Summer is popular; winter flying exists at some sites with cold, stable mornings.",
      ro: "Vara este populară; iarna există zbor la unele site-uri, cu dimineți reci și stabile.",
    },
  }),
  destination({
    id: "torrey-pines",
    slug: "torrey-pines",
    region: "northAmerica",
    countryCode: "US",
    latitude: 32.9203,
    longitude: -117.2538,
    names: { en: "Torrey Pines", ro: "Torrey Pines" },
    areas: { en: "San Diego, California, USA", ro: "San Diego, California, SUA" },
    shortDescriptions: {
      en: "Coastal ridge soaring above the Pacific cliffs.",
      ro: "Coastă oceanică deasupra stâncilor Pacific.",
    },
    overviews: {
      en:
        "Torrey Pines Gliderport is a historic coastal flying site where pilots ridge-soar above the ocean when onshore flow is smooth and within site rules.",
      ro:
        "Torrey Pines Gliderport este un site costier istoric pentru coastă când fluxul onshore este lin și în limitele regulilor locale.",
    },
    flyingContext: {
      en:
        "Marine layer and afternoon sea breeze shape flyable hours. GlideWeather helps track wind ramps and gust spread at your reference coordinates.",
      ro:
        "Stratul marin și briza de după-amiază definesc orele zborului. GlideWeather urmărește creșterea vântului și rafalele la coordonatele de referință.",
    },
    seasonality: {
      en: "Year-round flying with spring often offering classic smooth onshore days.",
      ro: "Zbor pe tot parcursul anului; primăvara oferă adesea zile onshore line.",
    },
    referenceUrl: "https://www.flytorrey.com/",
  }),
  destination({
    id: "valle-de-bravo",
    slug: "valle-de-bravo",
    region: "northAmerica",
    countryCode: "MX",
    latitude: 19.1783,
    longitude: -100.1309,
    names: { en: "Valle de Bravo", ro: "Valle de Bravo" },
    areas: { en: "Estado de México, Mexico", ro: "Estado de México, Mexic" },
    shortDescriptions: {
      en: "High-elevation lake town with strong XC culture.",
      ro: "Stațiune la altitudine, cultură XC puternică.",
    },
    overviews: {
      en:
        "Peñón launch above Valle de Bravo is a centerpiece of Mexican paragliding, hosting nationals and international pilots when thermals and airspace are favorable.",
      ro:
        "Decolarea Peñón deasupra Valle de Bravo este un punct central al parapantei mexicane, cu piloți naționali și internaționali când termica permite.",
    },
    flyingContext: {
      en:
        "Mid-day thermals and afternoon cloud build-up are common. Use GlideWeather for instability-related signals and ranked daylight hours in the forecast drawer logic.",
      ro:
        "Termica de la prânz și dezvoltarea norilor sunt frecvente. Folosește GlideWeather pentru semnale de instabilitate și orele de zi evaluate în prognoză.",
    },
    seasonality: {
      en: "Dry season (winter–spring) is busiest; summer rains raise convective risk.",
      ro: "Sezonul uscat (iarnă–primăvară) este cel mai aglomerat; ploile de vară cresc riscul convectiv.",
    },
  }),
  destination({
    id: "roldanillo",
    slug: "roldanillo",
    region: "southAmerica",
    countryCode: "CO",
    latitude: 4.4122,
    longitude: -76.1544,
    names: { en: "Roldanillo", ro: "Roldanillo" },
    areas: { en: "Valle del Cauca, Colombia", ro: "Valle del Cauca, Columbia" },
    shortDescriptions: {
      en: "Andean XC mecca with consistent thermal seasons.",
      ro: "Pol XC andin cu sezoane termice consistente.",
    },
    overviews: {
      en:
        "Roldanillo sits in Colombia’s Cauca Valley, a globally recognized destination for cross-country paragliding training and record attempts in the right season.",
      ro:
        "Roldanillo se află în valea Cauca, destinație recunoscută pentru instruire XC și încercări de record în sezonul potrivit.",
    },
    flyingContext: {
      en:
        "Deep valley winds and afternoon storms require disciplined timing. GlideWeather shows precipitation probability, visibility, and wind/gust evolution through the day.",
      ro:
        "Vântul de vale și furtunile de după-amiază cer timing disciplinat. GlideWeather arată probabilitatea de ploaie, vizibilitatea și evoluția vântului/rafalelor.",
    },
    seasonality: {
      en: "December–March is a core dry-season window; always confirm local storm forecasts.",
      ro: "Decembrie–martie este o fereastră uscată principală; confirmă prognozele locale de furtună.",
    },
  }),
  destination({
    id: "spot-bunloc",
    slug: "bunloc",
    region: "romania",
    countryCode: "RO",
    latitude: 45.5883,
    longitude: 25.6421,
    names: { en: "Bunloc", ro: "Bunloc" },
    areas: { en: "Săcele, Brașov", ro: "Săcele, Brașov" },
    shortDescriptions: {
      en: "Popular Carpathian training hill near Brașov.",
      ro: "Deal de instruire carpatin popular lângă Brașov.",
    },
    overviews: {
      en:
        "Bunloc is a well-used Romanian site above Săcele, often chosen for ridge soaring practice and introductory flights when valley wind stays moderate.",
      ro:
        "Bunloc este un site românesc folosit frecvent deasupra Săcelelor, ales pentru coastă și zboruri introductive când vântul de vale rămâne moderat.",
    },
    flyingContext: {
      en:
        "Postăvaru massif channeling can strengthen gusts. GlideWeather evaluates 10 m wind, gust spread, and visibility at Bunloc’s reference coordinates.",
      ro:
        "Canalizarea masivului Postăvaru poate intensifica rafalele. GlideWeather evaluează vântul la 10 m, diferența de rafale și vizibilitatea la coordonatele Bunloc.",
    },
    seasonality: {
      en: "Spring through autumn are typical; winter is cold with limited daylight.",
      ro: "Primăvara–toamna sunt tipice; iarna este rece, cu lumină limitată.",
    },
  }),
  destination({
    id: "spot-clopotiva",
    slug: "clopotiva",
    region: "romania",
    countryCode: "RO",
    latitude: 45.4742,
    longitude: 22.8053,
    names: { en: "Clopotiva", ro: "Clopotiva" },
    areas: { en: "Retezat, Hunedoara", ro: "Retezat, Hunedoara" },
    shortDescriptions: {
      en: "Retezat foothill flying in southwestern Carpathians.",
      ro: "Zbor în zona Retezat, Carpați sud-vestici.",
    },
    overviews: {
      en:
        "Clopotiva offers Carpathian scenery and accessible ridge flying for pilots familiar with Romanian site briefings and local wind patterns.",
      ro:
        "Clopotiva oferă peisaj carpatin și coastă accesibilă pentru piloți familiarizați cu briefingurile locale.",
    },
    flyingContext: {
      en:
        "Mountain valley winds and afternoon build-up matter. Check GlideWeather before driving from Hunedoara or Petroșani.",
      ro:
        "Vântul de vale și dezvoltarea de după-amiază contează. Verifică GlideWeather înainte de drum din Hunedoara sau Petroșani.",
    },
    seasonality: {
      en: "Summer and early autumn are most common; winter access can be limited.",
      ro: "Vara și începutul toamnei sunt cele mai frecvente; iarna accesul poate fi limitat.",
    },
  }),
  destination({
    id: "spot-postavarul",
    slug: "postavarul",
    region: "romania",
    countryCode: "RO",
    latitude: 45.5681,
    longitude: 25.5632,
    names: { en: "Postăvarul", ro: "Postăvarul" },
    areas: { en: "Poiana Brașov", ro: "Poiana Brașov" },
    shortDescriptions: {
      en: "Resort-area launches above Poiana Brașov.",
      ro: "Decolări în zona stațiunii Poiana Brașov.",
    },
    overviews: {
      en:
        "Postăvarul launches serve the Brașov ski resort area and are busy when ridge wind aligns with site orientation and ski-lift operations allow.",
      ro:
        "Decolările Postăvaru deservesc zona Poiana Brașov și sunt active când vântul de coastă se aliniază cu orientarea site-ului.",
    },
    flyingContext: {
      en:
        "Tourist traffic and changing valley wind require conservative calls. GlideWeather summarizes wind, gusts, and visibility for your grid point.",
      ro:
        "Traficul turistic și vântul de vale schimbător cer decizii conservatoare. GlideWeather rezumă vântul, rafalele și vizibilitatea.",
    },
    seasonality: {
      en: "Primary season May–September; shoulder months need extra caution.",
      ro: "Sezon principal mai–septembrie; lunile de tranziție necesită prudență.",
    },
  }),
  destination({
    id: "spot-sirnea",
    slug: "sirnea",
    region: "romania",
    countryCode: "RO",
    latitude: 45.4672,
    longitude: 25.2501,
    names: { en: "Șirnea", ro: "Șirnea" },
    areas: { en: "Piatra Craiului, Brașov", ro: "Piatra Craiului, Brașov" },
    shortDescriptions: {
      en: "Piatra Craiului foothill site with valley exposure.",
      ro: "Site la poalele Piatra Craiului, expus văii.",
    },
    overviews: {
      en:
        "Șirnea is a Carpathian village launch used when synoptic wind supports ridge flying along the Piatra Craiului edge.",
      ro:
        "Șirnea este o decolare de sat folosită când vântul sinoptic susține coasta de-a lungul crestei Piatra Craiului.",
    },
    flyingContext: {
      en:
        "Valley drainage and gusty afternoons are common. GlideWeather’s gust-spread signal is especially useful before committing to the drive.",
      ro:
        "Drainajul de vale și după-amiezile cu rafale sunt frecvente. Semnalul de diferență de rafale din GlideWeather este util înainte de drum.",
    },
    seasonality: {
      en: "Late spring through early autumn; winter is rarely flyable.",
      ro: "De la sfârșitul primăverii până la începutul toamnei; iarna rar zborabil.",
    },
  }),
  destination({
    id: "spot-pralea",
    slug: "pralea",
    region: "romania",
    countryCode: "RO",
    latitude: 46.1681,
    longitude: 26.8382,
    names: { en: "Pralea", ro: "Pralea" },
    areas: { en: "Căiuți, Bacău", ro: "Căiuți, Bacău" },
    shortDescriptions: {
      en: "Eastern Carpathian hill flying in Bacău county.",
      ro: "Zbor pe deal în Carpații Orientali, Bacău.",
    },
    overviews: {
      en:
        "Pralea is among the better-known hills in Moldavia for paragliding practice when wind stays within conservative limits.",
      ro:
        "Pralea este printre dealurile cunoscute din Moldova pentru practică când vântul rămâne în limite conservatoare.",
    },
    flyingContext: {
      en:
        "Continental thunderstorms can develop on summer afternoons. Monitor precipitation probability and CAPE-related cautions in GlideWeather.",
      ro:
        "Furtunile continentale pot apărea după-amiaza. Monitorizează probabilitatea de ploaie și atenționările CAPE în GlideWeather.",
    },
    seasonality: {
      en: "Summer is main season; spring and autumn need lower wind days.",
      ro: "Vara este sezonul principal; primăvara și toamna cer zile cu vânt redus.",
    },
  }),
  destination({
    id: "spot-rimetea",
    slug: "rimetea",
    region: "romania",
    countryCode: "RO",
    latitude: 46.4523,
    longitude: 23.5674,
    names: { en: "Rimetea", ro: "Rimetea" },
    areas: { en: "Piatra Secuiului, Alba", ro: "Piatra Secuiului, Alba" },
    shortDescriptions: {
      en: "Scenic Apuseni launch below Piatra Secuiului.",
      ro: "Decolare scenică în Apuseni, sub Piatra Secuiului.",
    },
    overviews: {
      en:
        "Rimetea offers picturesque Apuseni flying when ridge wind is steady and visibility remains good across the valley.",
      ro:
        "Rimetea oferă zbor pitoresc în Apuseni când vântul de coastă este stabil și vizibilitatea rămâne bună în vale.",
    },
    flyingContext: {
      en:
        "Light wind mornings can switch to gusty afternoons. GlideWeather’s favorable-until timing and hourly ranking reflect conservative filters, not site-specific rotor maps.",
      ro:
        "Diminețile cu vânt slab pot deveni după-amiezi cu rafale. Timingul „favorabil până la” și clasificarea orară reflectă filtre conservatoare, nu hărți locale de rotor.",
    },
    seasonality: {
      en: "May–September is typical; always confirm local club guidance.",
      ro: "Mai–septembrie este tipic; confirmă mereu ghidarea clubului local.",
    },
  }),
];

const bySlug = new Map(DESTINATIONS.map((d) => [d.slug, d]));
const byId = new Map(DESTINATIONS.map((d) => [d.id, d]));

export function getDestinationBySlug(slug: string): DestinationRecord | undefined {
  return bySlug.get(slug);
}

export function getDestinationById(id: string): DestinationRecord | undefined {
  return byId.get(id);
}

export function destinationPath(slug: string, locale: ContentLocale): string {
  return locale === "ro" ? `/ro/destinatii/${slug}` : `/destinations/${slug}`;
}

export function destinationForecastHref(id: string, locale: ContentLocale): string {
  const base = locale === "ro" ? "/ro" : "/";
  return `${base}?site=${encodeURIComponent(id)}`;
}

export const WORLDWIDE_FOOTER_DESTINATION_IDS = [
  "annecy",
  "interlaken",
  "bassano",
  "oludeniz",
  "pokhara",
  "bir-billing",
  "cape-town",
  "queenstown",
  "torrey-pines",
  "valle-de-bravo",
  "roldanillo",
] as const;

export const ROMANIA_FOOTER_DESTINATION_IDS = [
  "spot-bunloc",
  "spot-clopotiva",
  "spot-postavarul",
  "spot-sirnea",
  "spot-pralea",
  "spot-rimetea",
] as const;

export function footerDestinationsForContentLocale(locale: ContentLocale): DestinationRecord[] {
  const ids =
    locale === "ro" ? ROMANIA_FOOTER_DESTINATION_IDS : WORLDWIDE_FOOTER_DESTINATION_IDS;
  return ids.map((id) => getDestinationById(id)).filter((d): d is DestinationRecord => Boolean(d));
}
