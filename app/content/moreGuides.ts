import type { CopyLocale } from "../../content-locales";
import type { GuideCopyBundle } from "./guides";
import type { GuideRouteKey } from "../seo/types";

export type Pack = {
  disclaimer: string;
  updated: string;
  aboutTitle: string;
  aboutLead: string;
  problem: string;
  who: string;
  different: string;
  limits: string;
  howTitle: string;
  howLead: string;
  flow: string;
  output: string;
  data: string;
  weatherTitle: string;
  weatherLead: string;
  wind: string;
  visibility: string;
  precip: string;
  instability: string;
  air: string;
  whenTitle: string;
  whenLead: string;
  travel: string;
  day: string;
  monitor: string;
  windowTitle: string;
  windowLead: string;
  score: string;
  until: string;
  ranked: string;
  chart: string;
  faqTitle: string;
  faqLead: string;
  faq: readonly { question: string; answer: string }[];
  homeTitle: string;
  homeA: string;
  homeB: string;
  hubTitle: string;
  hubLead: string;
  hubUse: string;
  h: {
    problem: string;
    who: string;
    different: string;
    limits: string;
    flow: string;
    output: string;
    data: string;
    wind: string;
    visibility: string;
    precip: string;
    instability: string;
    air: string;
    travel: string;
    day: string;
    monitor: string;
    score: string;
    until: string;
    ranked: string;
    chart: string;
    use: string;
  };
};

const rel = (...keys: GuideRouteKey[]) => keys;

export function fromPack(pack: Pack): GuideCopyBundle {
  return {
    lastUpdatedLabel: pack.updated,
    disclaimer: pack.disclaimer,
    about: {
      h1: pack.aboutTitle,
      lead: pack.aboutLead,
      sections: [
        { id: "problem", heading: pack.h.problem, paragraphs: [pack.problem] },
        { id: "who", heading: pack.h.who, paragraphs: [pack.who] },
        { id: "different", heading: pack.h.different, paragraphs: [pack.different] },
        { id: "limits", heading: pack.h.limits, paragraphs: [pack.limits] },
      ],
      related: rel("howItWorks", "flightWindow", "faq"),
    },
    howItWorks: {
      h1: pack.howTitle,
      lead: pack.howLead,
      sections: [
        { id: "flow", heading: pack.h.flow, paragraphs: [pack.flow] },
        { id: "output", heading: pack.h.output, paragraphs: [pack.output] },
        { id: "data", heading: pack.h.data, paragraphs: [pack.data] },
      ],
      related: rel("paraglidingWeather", "flightWindow", "whenToFly"),
    },
    paraglidingWeather: {
      h1: pack.weatherTitle,
      lead: pack.weatherLead,
      sections: [
        { id: "wind", heading: pack.h.wind, paragraphs: [pack.wind] },
        { id: "visibility", heading: pack.h.visibility, paragraphs: [pack.visibility] },
        { id: "precip", heading: pack.h.precip, paragraphs: [pack.precip] },
        { id: "instability", heading: pack.h.instability, paragraphs: [pack.instability] },
        { id: "air", heading: pack.h.air, paragraphs: [pack.air] },
      ],
      related: rel("flightWindow", "whenToFly", "faq"),
    },
    whenToFly: {
      h1: pack.whenTitle,
      lead: pack.whenLead,
      sections: [
        { id: "travel", heading: pack.h.travel, paragraphs: [pack.travel] },
        { id: "day", heading: pack.h.day, paragraphs: [pack.day] },
        { id: "monitor", heading: pack.h.monitor, paragraphs: [pack.monitor] },
      ],
      related: rel("howItWorks", "destinationsHub", "faq"),
    },
    flightWindow: {
      h1: pack.windowTitle,
      lead: pack.windowLead,
      sections: [
        { id: "score", heading: pack.h.score, paragraphs: [pack.score] },
        { id: "until", heading: pack.h.until, paragraphs: [pack.until] },
        { id: "ranked", heading: pack.h.ranked, paragraphs: [pack.ranked] },
        { id: "chart", heading: pack.h.chart, paragraphs: [pack.chart] },
      ],
      related: rel("paraglidingWeather", "howItWorks", "faq"),
    },
    faq: {
      h1: pack.faqTitle,
      lead: pack.faqLead,
      sections: [],
      related: rel("about", "flightWindow", "paraglidingWeather"),
    },
    faqItems: pack.faq,
    homeIntro: { heading: pack.homeTitle, paragraphs: [pack.homeA, pack.homeB] },
    destinationsHub: {
      h1: pack.hubTitle,
      lead: pack.hubLead,
      sections: [{ id: "use", heading: pack.h.use, paragraphs: [pack.hubUse] }],
      related: rel("whenToFly", "paraglidingWeather", "about"),
    },
  };
}

const sharedHeadings = {
  it: {
    problem: "Quale problema risolve",
    who: "Per chi è",
    different: "Cosa lo distingue",
    limits: "Cosa non afferma",
    flow: "Il flusso",
    output: "Cosa vedi",
    data: "Fonti",
    wind: "Vento e raffiche a 10 m",
    visibility: "Visibilità",
    precip: "Precipitazioni",
    instability: "Instabilità e nubi",
    air: "Qualità dell’aria e UV",
    travel: "Prima di partire",
    day: "Nel giorno di volo",
    monitor: "Se cambia",
    score: "Punteggio",
    until: "Favorevole fino a…",
    ranked: "Ore di luce ordinate",
    chart: "Le prossime sei ore",
    use: "Come usare l’elenco",
  },
} as const;

function faq(
  items: readonly [string, string][],
): { question: string; answer: string }[] {
  return items.map(([question, answer]) => ({ question, answer }));
}

export const itPack: Pack = {
  disclaimer:
    "Aiuto alla decisione, non autorizzazione al volo. Verifica il vento reale in decollo, il rotore, la convezione, le regole dell’area e i tuoi limiti.",
  updated: "Ultimo aggiornamento",
  aboutTitle: "Informazioni su GlideWeather",
  aboutLead:
    "GlideWeather è una console meteo iperlocale per il parapendio: vento, raffiche, visibilità e instabilità prima di andare in decollo.",
  problem:
    "Le app meteo generiche mostrano numeri, raramente rispetto a limiti prudenti da parapendio. GlideWeather applica le stesse regole ovunque cerchi.",
  who: "Per piloti che conoscono già sito, spazio aereo e limiti personali. Non sostituisce il briefing né la scuola.",
  different:
    "Meteoblue se configurato sul server, altrimenti Open-Meteo. Ne escono punteggio, anello e motivi, non una raffica di campi grezzi.",
  limits: "Essere in elenco non significa che oggi si vola. GlideWeather non autorizza il decollo.",
  howTitle: "Come funziona GlideWeather",
  howLead: "Dalle coordinate al verdetto: luogo, previsione, segnali, finestra di volo.",
  flow: "Scegli un luogo con ricerca, mappa, GPS o preferenza salvata. Ogni ora è valutata con le stesse regole su vento, raffiche, spread, precipitazioni, visibilità e CAPE.",
  output:
    "Il pannello mostra vento, raffiche, base stimata, visibilità e sei ore. Il cassetto aggiunge i giorni, il CAPE e fino a quattro ore di luce che non sono no-go.",
  data: "Previsione: Meteoblue con chiave, altrimenti Open-Meteo. Qualità dell’aria e geocoding: Open-Meteo.",
  weatherTitle: "Meteo parapendio in GlideWeather",
  weatherLead: "Solo i valori che GlideWeather carica davvero e come entrano nel verdetto.",
  wind: "Vento troppo debole o forte, raffiche mancanti, raffiche alte e spread ampio sono segnali di rischio. Il vento a 80 m compare solo se il fornitore lo invia.",
  visibility: "Sotto circa 10 km cautela; sotto 5 km è no-go nelle regole automatiche.",
  precip: "Quantità e probabilità di pioggia influenzano il punteggio. Una frazione di neve alta aggrava il motivo.",
  instability:
    "Il CAPE sopra le soglie porta cautela o no-go. La base nel pannello è stimata da temperatura e umidità, non è un prodotto diretto del modello.",
  air: "AQI USA e UV alto possono togliere punti. Sono segnali di supporto, non il motivo principale del decollo.",
  whenTitle: "Quando usare GlideWeather",
  whenLead: "Momenti pratici: un anello verde non è il permesso di decollare.",
  travel: "Confronta vento e raffiche tra i siti. La pagina destinazione è contesto; la console è la previsione sul punto di riferimento.",
  day: "Leggi punteggio e motivi prima di montare e di nuovo se cambiano nubi o vento. La riga «favorevole fino a» è un indizio del modello.",
  monitor: "La risposta resta in cache circa 20 minuti. Poi un nuovo run può spostare le ore.",
  windowTitle: "Cos’è una finestra di volo?",
  windowLead: "In GlideWeather sono tre cose: il punteggio, la riga oraria e le ore di luce ordinate.",
  score: "Ogni campione parte da 100. I limiti duri forzano il no-go. Cautela o un punteggio sotto soglia è marginale, altrimenti buono.",
  until: "L’app scorre le ore del giorno e vede quanto dura lo stesso stato.",
  ranked: "Fino a quattro ore che non sono no-go. Sono ore singole, non un blocco. Vuoto significa che nessuna ora di luce ha passato i filtri.",
  chart: "I colori segnano ore buone il cui vento non sale di più di circa 3 km/h rispetto all’ora precedente.",
  faqTitle: "Domande frequenti meteo parapendio",
  faqLead: "Risposte allineate a come GlideWeather si comporta oggi.",
  faq: faq([
    ["Cos’è una finestra di volo in parapendio?", "Il punteggio 0–100, la durata dello stato attuale e fino a quattro ore di luce nel cassetto che non sono no-go."],
    ["Come controllo il meteo prima di volare?", "Cerca il sito o apri un link destinazione, leggi vento, raffiche, visibilità e motivi, poi la previsione completa."],
    ["Che vento usa GlideWeather?", "Soglie prudenti su vento a 10 m, raffiche e spread. Sono filtri di briefing, non limiti di legge universali."],
    ["GlideWeather mi dice se è sicuro?", "No. Decidi tu il decollo, con conoscenza locale e regole vigenti."],
    ["Posso controllare decolli diversi?", "Sì. Cerca nel mondo, sposta il pin, usa il GPS o i link alle destinazioni. ?site= è stato dell’app e non è indicizzato."],
    ["Quanto è accurata la previsione?", "Dipende da Meteoblue o Open-Meteo. Le risposte sono in cache breve. Sotto il 30 % di predicibilità Meteoblue compare una nota."],
    ["Quali dati usa?", "Meteoblue se configurato, altrimenti la previsione Open-Meteo; Open-Meteo per qualità dell’aria e ricerca luoghi."],
  ]),
  homeTitle: "Meteo parapendio in un solo posto",
  homeA: "GlideWeather trasforma la previsione iperlocale in un punteggio con motivi: vento, spread delle raffiche, visibilità, precipitazioni e instabilità.",
  homeB: "Le guide spiegano le regole. Le destinazioni aprono la console, senza dire che oggi si vola.",
  hubTitle: "Destinazioni popolari di parapendio",
  hubLead: "Una selezione per il briefing. Essere in elenco non significa che oggi si vola.",
  hubUse: "Ogni pagina descrive contesto, stagione e coordinate di riferimento. «Apri la previsione» carica la console. Gli URL con ?site= non sono pagine indicizzate.",
  h: sharedHeadings.it,
};

export const moreGuides: Partial<Record<CopyLocale, GuideCopyBundle>> = {
  it: fromPack(itPack),
  es: fromPack({
    ...itPack,
    disclaimer:
      "Ayuda para decidir, no autorización de vuelo. Confirma el viento real en el despegue, el rotor, la convección, las normas de la zona y tus propios límites.",
    updated: "Última actualización",
    aboutTitle: "Acerca de GlideWeather",
    aboutLead: "Consola de meteo hiperlocal para parapente: viento, rachas, visibilidad e inestabilidad antes de ir al despegue.",
    problem: "Las apps generales muestran cifras, rara vez frente a límites prudentes de parapente. GlideWeather aplica las mismas reglas en cada búsqueda.",
    who: "Para pilotos que ya conocen la zona, el espacio aéreo y sus límites. No sustituye el briefing ni la escuela.",
    different: "Meteoblue si el servidor está configurado; si no, Open-Meteo. De ahí salen puntuación, anillo y motivos.",
    limits: "Estar en la lista no significa que hoy se vuele. GlideWeather no autoriza el despegue.",
    howTitle: "Cómo funciona GlideWeather",
    howLead: "De las coordenadas al veredicto: lugar, pronóstico, señales y ventana de vuelo.",
    flow: "Eliges un lugar por búsqueda, mapa, GPS o preferencia guardada. Cada hora se evalúa con las mismas reglas de viento, rachas, amplitud, precipitación, visibilidad y CAPE.",
    output: "El panel muestra viento, rachas, base estimada, visibilidad y seis horas. El cajón añade días, CAPE y hasta cuatro horas de luz que no son no-go.",
    data: "Pronóstico: Meteoblue con clave, si no Open-Meteo. Calidad del aire y geocodificación: Open-Meteo.",
    weatherTitle: "Meteo parapente en GlideWeather",
    weatherLead: "Solo los valores que GlideWeather carga de verdad y cómo entran en el veredicto.",
    wind: "Viento demasiado flojo o fuerte, rachas ausentes, rachas altas y una amplitud grande son señales de riesgo.",
    visibility: "Por debajo de unos 10 km, precaución; por debajo de 5 km es no-go en las reglas automáticas.",
    precip: "La cantidad y la probabilidad de lluvia influyen en la puntuación.",
    instability: "El CAPE por encima de los umbrales aporta precaución o no-go. La base del panel se estima con temperatura y humedad.",
    air: "El AQI de EE. UU. y un UV alto pueden restar puntos. Son señales de apoyo.",
    whenTitle: "Cuándo usar GlideWeather",
    whenLead: "Momentos prácticos: un anillo verde no es permiso para despegar.",
    travel: "Compara viento y rachas entre zonas. La ficha es contexto; la consola es el pronóstico en el punto de referencia.",
    day: "Lee puntuación y motivos antes de montar y otra vez si cambian nubes o viento.",
    monitor: "La respuesta permanece en caché unos 20 minutos.",
    windowTitle: "¿Qué es una ventana de vuelo?",
    windowLead: "En GlideWeather son tres cosas: la puntuación, la línea horaria y las horas de luz ordenadas.",
    score: "Cada muestra empieza en 100. Los límites duros fuerzan no-go. Precaución o una puntuación bajo el umbral es marginal.",
    until: "La app recorre las horas del día y ve cuánto dura el mismo estado.",
    ranked: "Hasta cuatro horas que no son no-go. Son horas sueltas, no un bloque.",
    chart: "Los colores marcan horas buenas cuyo viento no sube más de unos 3 km/h respecto a la hora anterior.",
    faqTitle: "Preguntas frecuentes de meteo parapente",
    faqLead: "Respuestas alineadas con cómo se comporta GlideWeather hoy.",
    faq: faq([
      ["¿Qué es una ventana de vuelo de parapente?", "La puntuación 0–100, la duración del estado actual y hasta cuatro horas de luz que no son no-go."],
      ["¿Cómo miro el meteo antes de volar?", "Busca la zona o abre un destino, lee viento, rachas, visibilidad y motivos, y luego el pronóstico completo."],
      ["¿Qué viento usa GlideWeather?", "Umbrales prudentes de viento a 10 m, rachas y amplitud. Son filtros de briefing, no límites legales universales."],
      ["¿Me dice si es seguro?", "No. Tú decides el despegue, con conocimiento local y las normas vigentes."],
      ["¿Puedo mirar despegues distintos?", "Sí. Busca en el mundo, mueve el pin, usa el GPS o los enlaces. ?site= es estado de la app y no se indexa."],
      ["¿Qué precisión tiene el pronóstico?", "Depende de Meteoblue u Open-Meteo. Hay caché breve. Por debajo del 30 % de predecibilidad de Meteoblue aparece una nota."],
      ["¿Qué datos usa?", "Meteoblue si está configurado; si no, el pronóstico de Open-Meteo. Open-Meteo para calidad del aire y búsqueda de lugares."],
    ]),
    homeTitle: "Meteo parapente en un solo sitio",
    homeA: "GlideWeather convierte el pronóstico hiperlocal en una puntuación con motivos: viento, amplitud de rachas, visibilidad, precipitación e inestabilidad.",
    homeB: "Las guías explican las reglas. Los destinos abren la consola sin decir que hoy se vuela.",
    hubTitle: "Destinos populares de parapente",
    hubLead: "Una selección para el briefing. Estar en la lista no significa que hoy se vuele.",
    hubUse: "Cada página describe contexto, temporada y coordenadas de referencia. «Abrir el pronóstico» carga la consola.",
    h: {
      problem: "Qué problema resuelve",
      who: "Para quién es",
      different: "Qué lo distingue",
      limits: "Qué no afirma",
      flow: "El flujo",
      output: "Qué ves",
      data: "Fuentes",
      wind: "Viento y rachas a 10 m",
      visibility: "Visibilidad",
      precip: "Precipitación",
      instability: "Inestabilidad y nubes",
      air: "Calidad del aire y UV",
      travel: "Antes de salir",
      day: "El día de vuelo",
      monitor: "Si cambia",
      score: "Puntuación",
      until: "Favorable hasta…",
      ranked: "Horas de luz ordenadas",
      chart: "Las próximas seis horas",
      use: "Cómo usar la lista",
    },
  }),
};
