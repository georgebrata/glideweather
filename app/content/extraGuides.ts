import type { CopyLocale } from "../../content-locales";
import type { GuideCopyBundle, GuideSection } from "./guides";
import type { GuideRouteKey } from "../seo/types";

type Article = {
  h1: string;
  lead: string;
  sections: GuideSection[];
  related: GuideRouteKey[];
};

function article(
  h1: string,
  lead: string,
  sections: GuideSection[],
  related: GuideRouteKey[],
): Article {
  return { h1, lead, sections, related };
}

function bundle(input: {
  disclaimer: string;
  lastUpdated: string;
  about: Article;
  how: Article;
  weather: Article;
  when: Article;
  window: Article;
  faqH1: string;
  faqLead: string;
  faq: { question: string; answer: string }[];
  homeHeading: string;
  home: [string, string];
  hub: Article;
}): GuideCopyBundle {
  return {
    lastUpdatedLabel: input.lastUpdated,
    disclaimer: input.disclaimer,
    about: input.about,
    howItWorks: input.how,
    paraglidingWeather: input.weather,
    whenToFly: input.when,
    flightWindow: input.window,
    faq: {
      h1: input.faqH1,
      lead: input.faqLead,
      sections: [],
      related: ["about", "flightWindow", "paraglidingWeather"],
    },
    faqItems: input.faq,
    homeIntro: { heading: input.homeHeading, paragraphs: input.home },
    destinationsHub: input.hub,
  };
}

const flow = (heading: string, paragraphs: string[]): GuideSection => ({
  id: "flow",
  heading,
  paragraphs,
});

export const extraGuides: Partial<Record<CopyLocale, GuideCopyBundle>> = {
  de: bundle({
    disclaimer:
      "Entscheidungshilfe, keine Flugfreigabe. Prüfe den echten Wind am Start, Rotor, Konvektion, Gebietsregeln und deine eigenen Limits.",
    lastUpdated: "Zuletzt aktualisiert",
    about: article(
      "Über GlideWeather",
      "GlideWeather ist eine hyperlokale Wetterkonsole für Gleitschirmpiloten: Wind, Böen, Sicht und Labilität an einem Ort, bevor du zum Start fährst.",
      [
        {
          id: "problem",
          heading: "Welches Problem es löst",
          paragraphs: [
            "Normale Wetterapps zeigen Zahlen, aber selten, wie sie zu konservativen Gleitschirmgrenzen passen. GlideWeather bewertet jede Suche mit denselben Regeln.",
          ],
        },
        {
          id: "who",
          heading: "Für wen",
          paragraphs: [
            "Für Pilotinnen und Piloten, die Gelände, Luftraum und eigene Limits schon kennen. Es ersetzt kein Briefing und keine Schulung.",
          ],
        },
        {
          id: "different",
          heading: "Was anders ist",
          paragraphs: [
            "Meteoblue, wenn der Server konfiguriert ist, sonst Open-Meteo. Daraus werden Score, Ring und Gründe — keine Rohdatenflut.",
          ],
        },
        {
          id: "limits",
          heading: "Was es nicht behauptet",
          paragraphs: [
            "Ein Gebiet in der Liste ist keine Aussage, dass heute geflogen werden kann. GlideWeather gibt keinen Start frei.",
          ],
        },
      ],
      ["howItWorks", "flightWindow", "faq"],
    ),
    how: article(
      "So funktioniert GlideWeather",
      "Von den Koordinaten zum startorientierten Urteil: Ort, Prognose, Signale, Flugfenster.",
      [
        flow("Der Ablauf", [
          "Du wählst einen Ort per Suche, Karte, GPS oder gespeichertem Standard. Der Server holt eine normalisierte Prognose, kurz zwischengespeichert.",
          "Jede Stunde wird mit denselben konservativen Regeln für Wind, Böen, Spreizung, Niederschlag, Sicht und CAPE bewertet.",
        ]),
        {
          id: "output",
          heading: "Was du siehst",
          paragraphs: [
            "Die Hauptfläche zeigt Wind, Böen, geschätzte Basis, Sicht und sechs Stunden. Die Schublade zeigt Tagestabs, CAPE und bis zu vier Tageslichtstunden, die nicht no-go sind.",
          ],
        },
        {
          id: "data",
          heading: "Quellen",
          paragraphs: [
            "Prognose: Meteoblue mit Schlüssel, sonst Open-Meteo. Luftqualität und Geocoding: Open-Meteo.",
          ],
        },
      ],
      ["paraglidingWeather", "flightWindow", "whenToFly"],
    ),
    weather: article(
      "Gleitschirmwetter in GlideWeather",
      "Nur Werte, die GlideWeather wirklich lädt, und wie sie ins Urteil eingehen.",
      [
        {
          id: "wind",
          heading: "Wind und Böen in 10 m",
          paragraphs: [
            "Sehr wenig Wind, starker Wind, fehlende Böen, hohe Böen und große Spreizung sind Risikosignale. 80-m-Wind erscheint nur, wenn der Anbieter ihn liefert.",
          ],
        },
        {
          id: "visibility",
          heading: "Sicht",
          paragraphs: ["Unter etwa 10 km Vorsicht, unter 5 km no-go in den automatischen Regeln."],
        },
        {
          id: "precip",
          heading: "Niederschlag",
          paragraphs: ["Menge und Regenwahrscheinlichkeit beeinflussen den Score. Hoher Schneeanteil verschärft den Grund."],
        },
        {
          id: "instability",
          heading: "Labilität und Wolken",
          paragraphs: [
            "CAPE über den Schwellen bringt Vorsicht oder no-go. Die Basis in der Hauptansicht ist aus Temperatur und Feuchte geschätzt, kein direktes Modellprodukt.",
          ],
        },
        {
          id: "air",
          heading: "Luftqualität und UV",
          paragraphs: ["US-AQI und hoher UV-Index können Punkte abziehen. Sie sind Zusatz, nicht der Hauptgrund für den Start."],
        },
      ],
      ["flightWindow", "whenToFly", "faq"],
    ),
    when: article(
      "Wann du GlideWeather nutzt",
      "Praktische Momente — ein grüner Ring ist keine Starterlaubnis.",
      [
        {
          id: "travel",
          heading: "Vor der Fahrt",
          paragraphs: ["Vergleiche Wind und Böen zwischen Gebieten. Die Gebietsseite ist Kontext, die Konsole die Prognose am Referenzpunkt."],
        },
        {
          id: "day",
          heading: "Am Flugtag",
          paragraphs: ["Lies Score und Gründe vor dem Aufbauen und noch einmal, wenn Wolken oder Wind kippen. Die Zeile „günstig bis“ ist ein Modellhinweis."],
        },
        {
          id: "monitor",
          heading: "Wenn es sich ändert",
          paragraphs: ["Die Serverantwort bleibt etwa 20 Minuten im Cache. Danach kann ein neuer Modelllauf die Stundenliste verschieben."],
        },
      ],
      ["howItWorks", "destinationsHub", "faq"],
    ),
    window: article(
      "Was ist ein Flugfenster?",
      "Bei GlideWeather sind das drei Dinge: der Score, die Zeitzeile und die sortierten Tageslichtstunden.",
      [
        {
          id: "score",
          heading: "Flugvertrauen",
          paragraphs: ["Jede Probe startet bei 100. Harte Grenzen erzwingen no-go. Vorsicht oder ein Score unter der Schwelle ist marginal, sonst gut."],
        },
        {
          id: "until",
          heading: "Günstig bis …",
          paragraphs: ["Die App läuft die Stunden des Tages vor und sieht, wie lange derselbe Status hält."],
        },
        {
          id: "ranked",
          heading: "Sortierte Tageslichtstunden",
          paragraphs: ["Bis zu vier Stunden, die nicht no-go sind. Das sind einzelne Stunden, kein Block. Leer heißt: kein Tageslicht hat die Filter bestanden."],
        },
        {
          id: "chart",
          heading: "Die nächsten sechs Stunden",
          paragraphs: ["Farben markieren Stunden, die gut sind und deren Wind nicht mehr als etwa 3 km/h gegenüber der vorherigen Stunde zunimmt."],
        },
      ],
      ["paraglidingWeather", "howItWorks", "faq"],
    ),
    faqH1: "FAQ Gleitschirmwetter",
    faqLead: "Antworten, die zum heutigen Verhalten von GlideWeather passen.",
    faq: [
      {
        question: "Was ist ein Gleitschirm-Flugfenster?",
        answer:
          "Der Score 0–100, die Zeitspanne des aktuellen Status und bis zu vier Tageslichtstunden in der Schublade, die nicht no-go sind.",
      },
      {
        question: "Wie prüfe ich das Wetter vor dem Fliegen?",
        answer: "Suche das Gebiet oder öffne einen Gebietslink, lies Wind, Böen, Sicht und Gründe, dann die volle Prognose.",
      },
      {
        question: "Welchen Wind benutzt GlideWeather?",
        answer:
          "Konservative Schwellen für 10-m-Wind, Böen und Spreizung. Das sind Briefing-Filter, keine allgemeinen gesetzlichen Limits.",
      },
      {
        question: "Sagt mir GlideWeather, ob es sicher ist?",
        answer: "Nein. Nur du entscheidest den Start, mit Geländekenntnis und geltenden Regeln.",
      },
      {
        question: "Kann ich verschiedene Startplätze prüfen?",
        answer: "Ja. Suche weltweit, verschiebe den Pin, nutze GPS oder die Gebietslinks. ?site= bleibt Anwendungszustand und wird nicht indexiert.",
      },
      {
        question: "Wie genau ist die Prognose?",
        answer:
          "Sie hängt von Meteoblue oder Open-Meteo ab. Antworten werden kurz gecacht. Unter 30 % Meteoblue-Vorhersagbarkeit erscheint ein Hinweis.",
      },
      {
        question: "Welche Daten werden genutzt?",
        answer: "Meteoblue wenn konfiguriert, sonst Open-Meteo-Prognose; Open-Meteo für Luftqualität und Ortssuche.",
      },
    ],
    homeHeading: "Gleitschirmwetter an einem Ort",
    home: [
      "GlideWeather macht aus der hyperlokalen Prognose einen Score mit Gründen: Wind, Böenspreizung, Sicht, Niederschlag und Labilität.",
      "Die Ratgeber erklären die Regeln. Die Gebiete verlinken in die Konsole, ohne zu behaupten, dass heute geflogen wird.",
    ],
    hub: article(
      "Beliebte Gleitschirmgebiete",
      "Eine Auswahl zum Briefing. Ein Eintrag bedeutet nicht, dass heute geflogen werden kann.",
      [
        {
          id: "use",
          heading: "So nutzt du die Liste",
          paragraphs: [
            "Jede Seite nennt Kontext, Saison und Referenzkoordinaten. „Prognose öffnen“ lädt die Konsole. URLs mit ?site= werden nicht als eigene Seiten indexiert.",
          ],
        },
      ],
      ["whenToFly", "paraglidingWeather", "about"],
    ),
  }),
};
