import type { CopyLocale } from "../../content-locales";
import type { GuideRouteKey } from "./types";

export type RouteSlugKey = Exclude<GuideRouteKey, "home">;

export const ROUTE_SLUGS: Record<CopyLocale, Record<RouteSlugKey, string>> = {
  en: {
    about: "about",
    howItWorks: "how-it-works",
    paraglidingWeather: "paragliding-weather",
    whenToFly: "when-to-fly",
    flightWindow: "flight-window",
    faq: "faq",
    destinationsHub: "destinations",
  },
  ro: {
    about: "despre",
    howItWorks: "cum-functioneaza",
    paraglidingWeather: "meteo-parapanta",
    whenToFly: "cand-sa-zbori",
    flightWindow: "fereastra-de-zbor",
    faq: "intrebari-frecvente",
    destinationsHub: "destinatii",
  },
  de: {
    about: "ueber-uns",
    howItWorks: "so-funktioniert-es",
    paraglidingWeather: "gleitschirm-wetter",
    whenToFly: "wann-fliegen",
    flightWindow: "flugfenster",
    faq: "haeufige-fragen",
    destinationsHub: "fluggebiete",
  },
  it: {
    about: "informazioni",
    howItWorks: "come-funziona",
    paraglidingWeather: "meteo-parapendio",
    whenToFly: "quando-volare",
    flightWindow: "finestra-di-volo",
    faq: "domande-frequenti",
    destinationsHub: "destinazioni",
  },
  es: {
    about: "acerca",
    howItWorks: "como-funciona",
    paraglidingWeather: "meteo-parapente",
    whenToFly: "cuando-volar",
    flightWindow: "ventana-de-vuelo",
    faq: "preguntas-frecuentes",
    destinationsHub: "destinos",
  },
  pt: {
    about: "sobre",
    howItWorks: "como-funciona",
    paraglidingWeather: "meteo-parapente",
    whenToFly: "quando-voar",
    flightWindow: "janela-de-voo",
    faq: "perguntas-frequentes",
    destinationsHub: "destinos",
  },
  cs: {
    about: "o-nas",
    howItWorks: "jak-to-funguje",
    paraglidingWeather: "pocasi-paraglidingu",
    whenToFly: "kdy-letet",
    flightWindow: "letove-okno",
    faq: "casto-kladene-dotazy",
    destinationsHub: "destinace",
  },
  sk: {
    about: "o-nas",
    howItWorks: "ako-to-funguje",
    paraglidingWeather: "pocasie-paraglidingu",
    whenToFly: "kedy-lietat",
    flightWindow: "letove-okno",
    faq: "casto-kladene-otazky",
    destinationsHub: "destinacie",
  },
  sl: {
    about: "o-nas",
    howItWorks: "kako-deluje",
    paraglidingWeather: "vreme-za-jadralno-padalstvo",
    whenToFly: "kdaj-leteti",
    flightWindow: "letalno-okno",
    faq: "pogosta-vprasanja",
    destinationsHub: "destinacije",
  },
  nl: {
    about: "over",
    howItWorks: "hoe-het-werkt",
    paraglidingWeather: "paragliding-weer",
    whenToFly: "wanneer-vliegen",
    flightWindow: "vluchtvenster",
    faq: "veelgestelde-vragen",
    destinationsHub: "bestemmingen",
  },
  mt: {
    about: "dwar",
    howItWorks: "kif-jahdem",
    paraglidingWeather: "temp-paragliding",
    whenToFly: "meta-ttir",
    flightWindow: "tieqa-tat-titjira",
    faq: "mistoqsijiet",
    destinationsHub: "destinazzjonijiet",
  },
  tr: {
    about: "hakkinda",
    howItWorks: "nasil-calisir",
    paraglidingWeather: "yamac-parasutu-hava",
    whenToFly: "ne-zaman-ucus",
    flightWindow: "ucus-penceresi",
    faq: "sikca-sorulan-sorular",
    destinationsHub: "destinasyonlar",
  },
  hr: {
    about: "o-nama",
    howItWorks: "kako-radi",
    paraglidingWeather: "vrijeme-za-parajedrilicu",
    whenToFly: "kada-letjeti",
    flightWindow: "prozor-letenja",
    faq: "cesta-pitanja",
    destinationsHub: "odredista",
  },
  sr: {
    about: "o-nama",
    howItWorks: "kako-radi",
    paraglidingWeather: "vreme-za-paraglajding",
    whenToFly: "kada-leteti",
    flightWindow: "prozor-letenja",
    faq: "cesta-pitanja",
    destinationsHub: "destinacije",
  },
  sq: {
    about: "rreth",
    howItWorks: "si-funksionon",
    paraglidingWeather: "moti-paragliding",
    whenToFly: "kur-te-fluturosh",
    flightWindow: "dritarja-e-fluturimit",
    faq: "pyetje-te-shpeshta",
    destinationsHub: "destinacione",
  },
};

type SeoCopy = Record<GuideRouteKey, { title: string; description: string }>;

export const ROUTE_SEO: Record<CopyLocale, SeoCopy> = {
  en: {
    home: {
      title: "GlideWeather | Paragliding weather and flight conditions",
      description:
        "Hyperlocal paragliding weather: wind, gusts, visibility, and instability combined into a flight confidence score and launch-window guidance.",
    },
    about: {
      title: "About GlideWeather | Paragliding weather decision support",
      description:
        "What GlideWeather is, who it is for, and how hyperlocal forecast signals help paraglider pilots compare conditions before travelling to a launch site.",
    },
    howItWorks: {
      title: "How GlideWeather works | From location to flight window",
      description:
        "How GlideWeather turns launch-site coordinates into forecast data, flying-condition signals, and a conservative flight-window interpretation.",
    },
    paraglidingWeather: {
      title: "Paragliding weather guide | Wind, gusts, and instability",
      description:
        "Understand which weather parameters GlideWeather uses for paragliding—wind at 10 m, gust spread, visibility, precipitation, and CAPE—and how they affect the score.",
    },
    whenToFly: {
      title: "When to check paragliding weather | Planning a flying day",
      description:
        "Practical times to use GlideWeather: before travel, when comparing launch sites, and while monitoring changing wind and weather through the day.",
    },
    flightWindow: {
      title: "What is a paragliding flight window? | GlideWeather",
      description:
        "How GlideWeather defines a flight window: the 0–100 score, favorable-until timing, and ranked daylight hours that pass conservative filters.",
    },
    faq: {
      title: "Paragliding weather FAQ | GlideWeather",
      description:
        "Answers about flight windows, wind limits, forecast sources, launch sites, accuracy, and why GlideWeather is a decision aid—not flight authorization.",
    },
    destinationsHub: {
      title: "Popular paragliding destinations | GlideWeather",
      description:
        "Explore well-known paragliding flying areas and open hyperlocal weather for each reference launch region.",
    },
  },
  ro: {
    home: {
      title: "GlideWeather | Meteo parapantă și condiții de zbor",
      description:
        "Meteo hiperlocală pentru parapantă: vânt, rafale, vizibilitate și instabilitate într-un scor de încredere și ghidaj pentru fereastra de zbor.",
    },
    about: {
      title: "Despre GlideWeather | Ajutor la decizie meteo pentru parapantă",
      description:
        "Ce este GlideWeather, pentru cine este și cum semnalele meteo hiperlocale ajută piloții să compare condițiile înainte de a merge la decolare.",
    },
    howItWorks: {
      title: "Cum funcționează GlideWeather | De la locație la fereastra de zbor",
      description:
        "Cum transformă GlideWeather coordonatele într-o prognoză, semnale de zbor și o interpretare conservatoare a ferestrei de zbor.",
    },
    paraglidingWeather: {
      title: "Ghid meteo parapantă | Vânt, rafale și instabilitate",
      description:
        "Parametrii meteo folosiți de GlideWeather pentru parapantă—vânt la 10 m, rafale, vizibilitate, precipitații și CAPE—și cum influențează scorul.",
    },
    whenToFly: {
      title: "Când să verifici meteo pentru parapantă | Planificarea zilei de zbor",
      description:
        "Momente practice pentru GlideWeather: înainte de drum, la compararea site-urilor și când urmărești schimbările de vânt și vreme.",
    },
    flightWindow: {
      title: "Ce este fereastra de zbor parapantă? | GlideWeather",
      description:
        "Cum definește GlideWeather fereastra de zbor: scorul 0–100, intervalul „favorabil până la” și orele de zi care trec filtrele conservatoare.",
    },
    faq: {
      title: "Întrebări frecvente meteo parapantă | GlideWeather",
      description:
        "Răspunsuri despre ferestre de zbor, vânt, surse de prognoză, site-uri de decolare, acuratețe și de ce GlideWeather este ajutor la decizie, nu autorizare.",
    },
    destinationsHub: {
      title: "Destinații populare parapantă | GlideWeather",
      description:
        "Explorează zone cunoscute de zbor parapantă și deschide meteo hiperlocală pentru fiecare regiune de referință.",
    },
  },
  de: {
    home: {
      title: "GlideWeather | Gleitschirmwetter und Flugbedingungen",
      description:
        "Hyperlokales Gleitschirmwetter: Wind, Böen, Sicht und Labilität als Flugvertrauen und Startfenster.",
    },
    about: {
      title: "Über GlideWeather | Entscheidungshilfe für Gleitschirmwetter",
      description:
        "Was GlideWeather ist, für wen es gedacht ist und wie hyperlokale Prognosen die Bedingungen vor der Anfahrt vergleichbar machen.",
    },
    howItWorks: {
      title: "So funktioniert GlideWeather | Vom Ort zum Flugfenster",
      description:
        "Wie GlideWeather Koordinaten in Prognosedaten, Flugsignale und eine konservative Flugfenster-Deutung übersetzt.",
    },
    paraglidingWeather: {
      title: "Gleitschirmwetter | Wind, Böen und Labilität",
      description:
        "Welche Werte GlideWeather nutzt: Wind in 10 m, Böenspreizung, Sicht, Niederschlag und CAPE — und wie sie den Score beeinflussen.",
    },
    whenToFly: {
      title: "Wann Gleitschirmwetter prüfen | Den Flugtag planen",
      description:
        "Wann GlideWeather sinnvoll ist: vor der Fahrt, beim Vergleich von Startplätzen und wenn Wind und Wetter sich ändern.",
    },
    flightWindow: {
      title: "Was ist ein Gleitschirm-Flugfenster? | GlideWeather",
      description:
        "Score 0–100, die Zeile „günstig bis“ und bis zu vier Tageslichtstunden, die die konservativen Filter bestehen.",
    },
    faq: {
      title: "FAQ Gleitschirmwetter | GlideWeather",
      description:
        "Antworten zu Flugfenster, Windgrenzen, Datenquellen, Startplätzen und warum GlideWeather eine Entscheidungshilfe ist, keine Freigabe.",
    },
    destinationsHub: {
      title: "Beliebte Gleitschirmgebiete | GlideWeather",
      description:
        "Bekannte Fluggebiete und hyperlokales Wetter für jeden Referenzpunkt. Ein Eintrag sagt nicht, dass heute geflogen werden kann.",
    },
  },
  it: {
    home: {
      title: "GlideWeather | Meteo parapendio e condizioni di volo",
      description:
        "Meteo iperlocale per il parapendio: vento, raffiche, visibilità e instabilità in un punteggio e in una finestra di decollo.",
    },
    about: {
      title: "Informazioni su GlideWeather | Supporto alla decisione meteo",
      description:
        "Cos’è GlideWeather, a chi serve e come i segnali meteo iperlocali aiutano a confrontare le condizioni prima di andare in decollo.",
    },
    howItWorks: {
      title: "Come funziona GlideWeather | Dal luogo alla finestra di volo",
      description:
        "Come le coordinate diventano una previsione, segnali di volo e un’interpretazione prudente della finestra di volo.",
    },
    paraglidingWeather: {
      title: "Meteo parapendio | Vento, raffiche e instabilità",
      description:
        "I parametri usati da GlideWeather: vento a 10 m, spread delle raffiche, visibilità, precipitazioni e CAPE, e come influenzano il punteggio.",
    },
    whenToFly: {
      title: "Quando controllare il meteo parapendio | Pianificare la giornata",
      description:
        "Quando usare GlideWeather: prima di partire, confrontando decolli e mentre vento e meteo cambiano durante il giorno.",
    },
    flightWindow: {
      title: "Cos’è una finestra di volo in parapendio? | GlideWeather",
      description:
        "Punteggio 0–100, l’orario «favorevole fino a» e fino a quattro ore di luce che superano i filtri prudenti.",
    },
    faq: {
      title: "Domande frequenti meteo parapendio | GlideWeather",
      description:
        "Risposte su finestre di volo, vento, fonti, decolli e perché GlideWeather è un aiuto alla decisione, non un’autorizzazione.",
    },
    destinationsHub: {
      title: "Destinazioni popolari di parapendio | GlideWeather",
      description:
        "Zone di volo note e meteo iperlocale per ogni punto di riferimento. Essere in elenco non significa che oggi si vola.",
    },
  },
  es: {
    home: {
      title: "GlideWeather | Meteo parapente y condiciones de vuelo",
      description:
        "Meteo hiperlocal para parapente: viento, rachas, visibilidad e inestabilidad en una puntuación y una ventana de despegue.",
    },
    about: {
      title: "Acerca de GlideWeather | Ayuda para decidir el meteo",
      description:
        "Qué es GlideWeather, para quién es y cómo las señales hiperlocales ayudan a comparar condiciones antes de ir al despegue.",
    },
    howItWorks: {
      title: "Cómo funciona GlideWeather | Del lugar a la ventana de vuelo",
      description:
        "Cómo las coordenadas se convierten en pronóstico, señales de vuelo y una lectura prudente de la ventana de vuelo.",
    },
    paraglidingWeather: {
      title: "Meteo parapente | Viento, rachas e inestabilidad",
      description:
        "Parámetros que usa GlideWeather: viento a 10 m, amplitud de rachas, visibilidad, precipitación y CAPE, y cómo afectan a la puntuación.",
    },
    whenToFly: {
      title: "Cuándo consultar el meteo parapente | Planear el día",
      description:
        "Cuándo usar GlideWeather: antes de viajar, al comparar despegues y mientras cambian el viento y el tiempo.",
    },
    flightWindow: {
      title: "¿Qué es una ventana de vuelo de parapente? | GlideWeather",
      description:
        "Puntuación 0–100, el aviso «favorable hasta» y hasta cuatro horas de luz que pasan los filtros prudentes.",
    },
    faq: {
      title: "Preguntas frecuentes de meteo parapente | GlideWeather",
      description:
        "Respuestas sobre ventanas de vuelo, viento, fuentes, despegues y por qué GlideWeather es una ayuda, no una autorización.",
    },
    destinationsHub: {
      title: "Destinos populares de parapente | GlideWeather",
      description:
        "Zonas de vuelo conocidas y meteo hiperlocal para cada punto de referencia. Figurar en la lista no significa que hoy se vuele.",
    },
  },
  pt: {
    home: {
      title: "GlideWeather | Meteo parapente e condições de voo",
      description:
        "Meteo hiperlocal para parapente: vento, rajadas, visibilidade e instabilidade numa pontuação e numa janela de descolagem.",
    },
    about: {
      title: "Sobre o GlideWeather | Apoio à decisão meteorológica",
      description:
        "O que é o GlideWeather, para quem serve e como os sinais hiperlocais ajudam a comparar condições antes de ir para a descolagem.",
    },
    howItWorks: {
      title: "Como funciona o GlideWeather | Do local à janela de voo",
      description:
        "Como as coordenadas se tornam previsão, sinais de voo e uma leitura prudente da janela de voo.",
    },
    paraglidingWeather: {
      title: "Meteo parapente | Vento, rajadas e instabilidade",
      description:
        "Parâmetros usados pelo GlideWeather: vento a 10 m, amplitude de rajadas, visibilidade, precipitação e CAPE, e como afetam a pontuação.",
    },
    whenToFly: {
      title: "Quando consultar o meteo parapente | Planear o dia",
      description:
        "Quando usar o GlideWeather: antes da viagem, ao comparar descolagens e enquanto o vento e o tempo mudam.",
    },
    flightWindow: {
      title: "O que é uma janela de voo de parapente? | GlideWeather",
      description:
        "Pontuação 0–100, a indicação «favorável até» e até quatro horas de luz que passam os filtros prudentes.",
    },
    faq: {
      title: "Perguntas frequentes de meteo parapente | GlideWeather",
      description:
        "Respostas sobre janelas de voo, vento, fontes, descolagens e porque o GlideWeather é uma ajuda à decisão, não uma autorização.",
    },
    destinationsHub: {
      title: "Destinos populares de parapente | GlideWeather",
      description:
        "Zonas de voo conhecidas e meteo hiperlocal para cada ponto de referência. Estar na lista não significa que hoje se voa.",
    },
  },
  cs: {
    home: {
      title: "GlideWeather | Počasí pro paragliding a letové podmínky",
      description:
        "Hyperlokální počasí pro paragliding: vítr, nárazy, dohlednost a nestabilita ve skóre a v letovém okně.",
    },
    about: {
      title: "O GlideWeather | Pomoc při rozhodování o počasí",
      description:
        "Co je GlideWeather, pro koho je a jak hyperlokální signály pomáhají porovnat podmínky před cestou na start.",
    },
    howItWorks: {
      title: "Jak GlideWeather funguje | Od místa k letovému oknu",
      description:
        "Jak se souřadnice mění v předpověď, letové signály a opatrný výklad letového okna.",
    },
    paraglidingWeather: {
      title: "Počasí pro paragliding | Vítr, nárazy a nestabilita",
      description:
        "Parametry, které GlideWeather používá: vítr v 10 m, rozptyl nárazů, dohlednost, srážky a CAPE a jak ovlivňují skóre.",
    },
    whenToFly: {
      title: "Kdy kontrolovat počasí pro paragliding | Plán dne",
      description:
        "Kdy GlideWeather otevřít: před cestou, při porovnání startů a když se vítr a počasí během dne mění.",
    },
    flightWindow: {
      title: "Co je letové okno v paraglidingu? | GlideWeather",
      description:
        "Skóre 0–100, řádek „příznivé do“ a až čtyři denní hodiny, které projdou opatrnými filtry.",
    },
    faq: {
      title: "Časté otázky k počasí pro paragliding | GlideWeather",
      description:
        "Odpovědi o letovém okně, větru, zdrojích, startech a proč je GlideWeather pomůcka k rozhodnutí, ne povolení letu.",
    },
    destinationsHub: {
      title: "Oblíbené paraglidingové lokality | GlideWeather",
      description:
        "Známé letové oblasti a hyperlokální počasí pro každý referenční bod. Záznam neznamená, že se dnes létá.",
    },
  },
  sk: {
    home: {
      title: "GlideWeather | Počasie pre paragliding a letové podmienky",
      description:
        "Hyperlokálne počasie pre paragliding: vietor, nárazy, dohľadnosť a nestabilita v skóre a v letovom okne.",
    },
    about: {
      title: "O GlideWeather | Pomoc pri rozhodovaní o počasí",
      description:
        "Čo je GlideWeather, pre koho je a ako hyperlokálne signály pomáhajú porovnať podmienky pred cestou na štart.",
    },
    howItWorks: {
      title: "Ako GlideWeather funguje | Od miesta k letovému oknu",
      description:
        "Ako sa súradnice menia na predpoveď, letové signály a opatrný výklad letového okna.",
    },
    paraglidingWeather: {
      title: "Počasie pre paragliding | Vietor, nárazy a nestabilita",
      description:
        "Parametre, ktoré GlideWeather používa: vietor v 10 m, rozptyl nárazov, dohľadnosť, zrážky a CAPE a ako ovplyvňujú skóre.",
    },
    whenToFly: {
      title: "Kedy kontrolovať počasie pre paragliding | Plán dňa",
      description:
        "Kedy otvoriť GlideWeather: pred cestou, pri porovnaní štartov a keď sa vietor a počasie cez deň menia.",
    },
    flightWindow: {
      title: "Čo je letové okno v paraglidingu? | GlideWeather",
      description:
        "Skóre 0–100, riadok „priaznivé do“ a až štyri denné hodiny, ktoré prejdú opatrnými filtrami.",
    },
    faq: {
      title: "Časté otázky k počasiu pre paragliding | GlideWeather",
      description:
        "Odpovede o letovom okne, vetre, zdrojoch, štartoch a prečo je GlideWeather pomôcka na rozhodnutie, nie povolenie letu.",
    },
    destinationsHub: {
      title: "Obľúbené paraglidingové lokality | GlideWeather",
      description:
        "Známe letové oblasti a hyperlokálne počasie pre každý referenčný bod. Záznam neznamená, že sa dnes lieta.",
    },
  },
  sl: {
    home: {
      title: "GlideWeather | Vreme za jadralno padalstvo in razmere",
      description:
        "Hiperlokalno vreme za jadralno padalstvo: veter, sunki, vidljivost in nestabilnost v oceni in v letalnem oknu.",
    },
    about: {
      title: "O GlideWeather | Pomoč pri odločitvi o vremenu",
      description:
        "Kaj je GlideWeather, za koga je in kako hiperlokalni signali pomagajo primerjati razmere pred potjo na vzletišče.",
    },
    howItWorks: {
      title: "Kako deluje GlideWeather | Od lokacije do letalnega okna",
      description:
        "Kako koordinate postanejo napoved, letalni signali in previdna razlaga letalnega okna.",
    },
    paraglidingWeather: {
      title: "Vreme za jadralno padalstvo | Veter, sunki in nestabilnost",
      description:
        "Parametri, ki jih uporablja GlideWeather: veter na 10 m, razpon sunkov, vidljivost, padavine in CAPE ter kako vplivajo na oceno.",
    },
    whenToFly: {
      title: "Kdaj preveriti vreme za jadralno padalstvo | Načrt dneva",
      description:
        "Kdaj odpreti GlideWeather: pred potjo, ob primerjavi vzletišč in ko se veter in vreme čez dan spreminjata.",
    },
    flightWindow: {
      title: "Kaj je letalno okno v jadralnem padalstvu? | GlideWeather",
      description:
        "Ocena 0–100, vrstica „ugodno do“ in do štiri dnevne ure, ki prestanejo previdne filtre.",
    },
    faq: {
      title: "Pogosta vprašanja o vremenu za jadralno padalstvo | GlideWeather",
      description:
        "Odgovori o letalnem oknu, vetru, virih, vzletiščih in zakaj je GlideWeather pomoč pri odločitvi, ne dovoljenje za let.",
    },
    destinationsHub: {
      title: "Priljubljene destinacije za jadralno padalstvo | GlideWeather",
      description:
        "Znana letalna območja in hiperlokalno vreme za vsako referenčno točko. Vnos ne pomeni, da se danes leta.",
    },
  },
  nl: {
    home: {
      title: "GlideWeather | Paraglidingweer en vluchtomstandigheden",
      description:
        "Hyperlokaal paraglidingweer: wind, vlagen, zicht en instabiliteit in een score en een startvenster.",
    },
    about: {
      title: "Over GlideWeather | Beslishulp voor paraglidingweer",
      description:
        "Wat GlideWeather is, voor wie het is en hoe hyperlokale signalen helpen omstandigheden te vergelijken vóór je naar de start rijdt.",
    },
    howItWorks: {
      title: "Hoe GlideWeather werkt | Van locatie naar vluchtvenster",
      description:
        "Hoe coördinaten een verwachting, vliegsignalen en een voorzichtige lezing van het vluchtvenster worden.",
    },
    paraglidingWeather: {
      title: "Paraglidingweer | Wind, vlagen en instabiliteit",
      description:
        "Parameters die GlideWeather gebruikt: wind op 10 m, vlaagspreiding, zicht, neerslag en CAPE, en hoe ze de score beïnvloeden.",
    },
    whenToFly: {
      title: "Wanneer paraglidingweer checken | De vliegdag plannen",
      description:
        "Wanneer je GlideWeather opent: vóór de rit, bij het vergelijken van starts en als wind en weer overdag veranderen.",
    },
    flightWindow: {
      title: "Wat is een paragliding-vluchtvenster? | GlideWeather",
      description:
        "Score 0–100, de regel „gunstig tot“ en tot vier daglichturen die de voorzichtige filters halen.",
    },
    faq: {
      title: "Veelgestelde vragen over paraglidingweer | GlideWeather",
      description:
        "Antwoorden over vluchtvensters, wind, bronnen, starts en waarom GlideWeather een beslishulp is, geen toestemming.",
    },
    destinationsHub: {
      title: "Populaire paraglidingbestemmingen | GlideWeather",
      description:
        "Bekende vlieggebieden en hyperlokaal weer voor elk referentiepunt. Op de lijst staan betekent niet dat het vandaag vliegbaar is.",
    },
  },
  mt: {
    home: {
      title: "GlideWeather | Temp għall-paragliding u kundizzjonijiet tat-titjira",
      description:
        "Temp iperlokali għall-paragliding: riħ, buffuri, viżibilità u instabbiltà f’punteġġ u f’tieqa tat-titjira.",
    },
    about: {
      title: "Dwar GlideWeather | Għajnuna għad-deċiżjoni tat-temp",
      description:
        "X’inhu GlideWeather, għal min hu, u kif is-sinjali iperlokali jgħinu tqabbel il-kundizzjonijiet qabel tmur għat-tlugħ.",
    },
    howItWorks: {
      title: "Kif jaħdem GlideWeather | Mill-post għat-tieqa tat-titjira",
      description:
        "Kif il-koordinati jsiru tbassir, sinjali tat-titjira u qari prudenti tat-tieqa tat-titjira.",
    },
    paraglidingWeather: {
      title: "Temp għall-paragliding | Riħ, buffuri u instabbiltà",
      description:
        "Il-parametri li juża GlideWeather: riħ f’10 m, firxa tal-buffuri, viżibilità, xita u CAPE, u kif jaffettwaw il-punteġġ.",
    },
    whenToFly: {
      title: "Meta tiċċekkja t-temp għall-paragliding | Ippjana l-ġurnata",
      description:
        "Meta tiftaħ GlideWeather: qabel il-vjaġġ, meta tqabbel it-tlugħ, u waqt li r-riħ u t-temp jinbidlu.",
    },
    flightWindow: {
      title: "X’inhi tieqa tat-titjira fil-paragliding? | GlideWeather",
      description:
        "Punteġġ 0–100, il-linja „favorevoli sa“ u sa erba’ sigħat ta’ dawl li jgħaddu l-filtri prudenti.",
    },
    faq: {
      title: "Mistoqsijiet dwar it-temp għall-paragliding | GlideWeather",
      description:
        "Tweġibiet dwar it-tieqa tat-titjira, ir-riħ, is-sorsi, it-tlugħ, u għaliex GlideWeather huwa għajnuna, mhux awtorizzazzjoni.",
    },
    destinationsHub: {
      title: "Destinazzjonijiet popolari tal-paragliding | GlideWeather",
      description:
        "Żoni magħrufa u temp iperlokali għal kull punt ta’ referenza. Li tidher fil-lista ma jfissirx li llum tista’ ttir.",
    },
  },
  tr: {
    home: {
      title: "GlideWeather | Yamaç paraşütü hava durumu ve uçuş koşulları",
      description:
        "Yamaç paraşütü için hiper yerel hava: rüzgar, hamle, görüş ve kararsızlık bir puanda ve uçuş penceresinde.",
    },
    about: {
      title: "GlideWeather hakkında | Hava kararı için destek",
      description:
        "GlideWeather nedir, kim içindir ve hiper yerel sinyaller kalkışa gitmeden koşulları karşılaştırmaya nasıl yardım eder.",
    },
    howItWorks: {
      title: "GlideWeather nasıl çalışır | Konumdan uçuş penceresine",
      description:
        "Koordinatlar nasıl tahmine, uçuş sinyallerine ve temkinli bir uçuş penceresi okumasına dönüşür.",
    },
    paraglidingWeather: {
      title: "Yamaç paraşütü havası | Rüzgar, hamle ve kararsızlık",
      description:
        "GlideWeather’ın kullandığı değerler: 10 m rüzgar, hamle farkı, görüş, yağış ve CAPE ve puanı nasıl etkiledikleri.",
    },
    whenToFly: {
      title: "Yamaç paraşütü havası ne zaman bakılır | Günü planlamak",
      description:
        "GlideWeather ne zaman açılır: yola çıkmadan, kalkışları karşılaştırırken ve rüzgar ile hava gün içinde değişirken.",
    },
    flightWindow: {
      title: "Yamaç paraşütünde uçuş penceresi nedir? | GlideWeather",
      description:
        "0–100 puan, „şu saate kadar uygun“ satırı ve temkinli filtreleri geçen en fazla dört gündüz saati.",
    },
    faq: {
      title: "Yamaç paraşütü hava durumu SSS | GlideWeather",
      description:
        "Uçuş penceresi, rüzgar, kaynaklar, kalkışlar ve GlideWeather’ın neden izin değil karar desteği olduğu.",
    },
    destinationsHub: {
      title: "Popüler yamaç paraşütü bölgeleri | GlideWeather",
      description:
        "Bilinen uçuş alanları ve her referans noktası için hiper yerel hava. Listede olmak bugün uçulur demek değildir.",
    },
  },
  hr: {
    home: {
      title: "GlideWeather | Vrijeme za parajedrilicu i uvjeti leta",
      description:
        "Hiperlokalno vrijeme za parajedrilicu: vjetar, udari, vidljivost i nestabilnost u ocjeni i u prozoru letenja.",
    },
    about: {
      title: "O GlideWeatheru | Pomoć pri odluci o vremenu",
      description:
        "Što je GlideWeather, za koga je i kako hiperlokalni signali pomažu usporediti uvjete prije odlaska na start.",
    },
    howItWorks: {
      title: "Kako radi GlideWeather | Od lokacije do prozora letenja",
      description:
        "Kako koordinate postaju prognoza, letni signali i oprezna ocjena prozora letenja.",
    },
    paraglidingWeather: {
      title: "Vrijeme za parajedrilicu | Vjetar, udari i nestabilnost",
      description:
        "Parametri koje GlideWeather koristi: vjetar na 10 m, raspon udara, vidljivost, oborina i CAPE te kako utječu na ocjenu.",
    },
    whenToFly: {
      title: "Kad provjeriti vrijeme za parajedrilicu | Plan dana",
      description:
        "Kad otvoriti GlideWeather: prije puta, pri usporedbi startova i dok se vjetar i vrijeme tijekom dana mijenjaju.",
    },
    flightWindow: {
      title: "Što je prozor letenja u parajedrilici? | GlideWeather",
      description:
        "Ocjena 0–100, redak „povoljno do“ i do četiri dnevna sata koja prolaze oprezne filtre.",
    },
    faq: {
      title: "Česta pitanja o vremenu za parajedrilicu | GlideWeather",
      description:
        "Odgovori o prozoru letenja, vjetru, izvorima, startovima i zašto je GlideWeather pomoć pri odluci, a ne odobrenje leta.",
    },
    destinationsHub: {
      title: "Popularna odredišta za parajedrilicu | GlideWeather",
      description:
        "Poznata letna područja i hiperlokalno vrijeme za svaku referentnu točku. Unos ne znači da se danas leti.",
    },
  },
  sr: {
    home: {
      title: "GlideWeather | Vreme za paraglajding i uslovi leta",
      description:
        "Hiperlokalno vreme za paraglajding: vetar, udari, vidljivost i nestabilnost u oceni i u prozoru letenja.",
    },
    about: {
      title: "O GlideWeather-u | Pomoć pri odluci o vremenu",
      description:
        "Šta je GlideWeather, za koga je i kako hiperlokalni signali pomažu da se uporede uslovi pre odlaska na start.",
    },
    howItWorks: {
      title: "Kako radi GlideWeather | Od lokacije do prozora letenja",
      description:
        "Kako koordinate postaju prognoza, letni signali i oprezna ocena prozora letenja.",
    },
    paraglidingWeather: {
      title: "Vreme za paraglajding | Vetar, udari i nestabilnost",
      description:
        "Parametri koje GlideWeather koristi: vetar na 10 m, raspon udara, vidljivost, padavine i CAPE i kako utiču na ocenu.",
    },
    whenToFly: {
      title: "Kada proveriti vreme za paraglajding | Plan dana",
      description:
        "Kada otvoriti GlideWeather: pre puta, pri poređenju startova i dok se vetar i vreme tokom dana menjaju.",
    },
    flightWindow: {
      title: "Šta je prozor letenja u paraglajdingu? | GlideWeather",
      description:
        "Ocena 0–100, red „povoljno do“ i do četiri dnevna sata koja prolaze oprezne filtere.",
    },
    faq: {
      title: "Česta pitanja o vremenu za paraglajding | GlideWeather",
      description:
        "Odgovori o prozoru letenja, vetru, izvorima, startovima i zašto je GlideWeather pomoć pri odluci, a ne odobrenje leta.",
    },
    destinationsHub: {
      title: "Popularne destinacije za paraglajding | GlideWeather",
      description:
        "Poznata letna područja i hiperlokalno vreme za svaku referentnu tačku. Unos ne znači da se danas leti.",
    },
  },
  sq: {
    home: {
      title: "GlideWeather | Moti për paragliding dhe kushtet e fluturimit",
      description:
        "Moti hiperlokal për paragliding: era, goditjet, dukshmëria dhe paqëndrueshmëria në një pikë dhe në një dritare fluturimi.",
    },
    about: {
      title: "Rreth GlideWeather | Ndihmë për vendimin e motit",
      description:
        "Çfarë është GlideWeather, për kë është dhe si sinjalet hiperlokale ndihmojnë të krahasohen kushtet para se të shkosh në nisje.",
    },
    howItWorks: {
      title: "Si funksionon GlideWeather | Nga vendi te dritarja e fluturimit",
      description:
        "Si koordinatat bëhen parashikim, sinjale fluturimi dhe një lexim i kujdesshëm i dritares së fluturimit.",
    },
    paraglidingWeather: {
      title: "Moti për paragliding | Era, goditjet dhe paqëndrueshmëria",
      description:
        "Parametrat që përdor GlideWeather: era në 10 m, hapësira e goditjeve, dukshmëria, reshjet dhe CAPE dhe si ndikojnë pikën.",
    },
    whenToFly: {
      title: "Kur të kontrollosh motin për paragliding | Planifikimi i ditës",
      description:
        "Kur të hapësh GlideWeather: para rrugës, kur krahason nisjet dhe ndërsa era dhe moti ndryshojnë gjatë ditës.",
    },
    flightWindow: {
      title: "Çfarë është dritarja e fluturimit në paragliding? | GlideWeather",
      description:
        "Pika 0–100, rreshti „e favorshme deri“ dhe deri në katër orë drite që kalojnë filtrat e kujdesshëm.",
    },
    faq: {
      title: "Pyetje të shpeshta për motin e paraglidingut | GlideWeather",
      description:
        "Përgjigje për dritaren e fluturimit, erën, burimet, nisjet dhe pse GlideWeather është ndihmë për vendim, jo autorizim.",
    },
    destinationsHub: {
      title: "Destinacione të njohura paragliding | GlideWeather",
      description:
        "Zona të njohura fluturimi dhe mot hiperlokal për çdo pikë reference. Të jesh në listë nuk do të thotë që sot fluturohet.",
    },
  },
};
