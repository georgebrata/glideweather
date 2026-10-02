import type { LocaleText } from "./en";

export const ro = {
  meta: {
    documentLang: "ro",
    localeName: "Romanian",
    nativeName: "Română",
    title: "GlideWeather · Meteo de zbor",
    description:
      "Verdict de lansare pentru parapantă: vânt, rafale, vizibilitate și instabilitate.",
  },
  common: {
    notAvailable: "n/d",
    scoreDenominator: "/100",
    scoreOutOf100: (score: number) => `Scor GlideWeather ${score} din 100`,
  },
  language: {
    label: "Limbă",
    tooltip: "Schimbă limba",
    clear: "Golește",
    close: "Închide",
    open: "Deschide",
    noOptions: "Nicio țară găsită",
  },
  theme: {
    enableLight: "Activează tema luminoasă",
    enableDark: "Activează tema întunecată",
  },
  errors: {
    weatherServiceStatus: (status: number) =>
      `Serviciul meteo a răspuns cu status ${status}`,
  },
  sources: {
    forecast: "prognoză Open-Meteo",
    airQuality: "calitate aer Open-Meteo",
    geocoding: "hartă Open-Meteo",
    gps: "GPS browser",
  },
  statusTone: {
    good: "fereastră bună",
    marginal: "la limită",
    noGo: "nu lansa",
  },
  location: {
    unavailable:
      "Poziția browserului nu este disponibilă. Caută o zonă de decolare sau o localitate.",
    permissionDenied:
      "Permisiunea de localizare nu este activă. Caută manual o zonă de decolare sau o localitate.",
    currentPosition: "Poziția curentă",
    uncalibratedCoordinates: "Coordonate necalibrate",
    useBrowserPosition: "Folosește poziția browserului",
    myPosition: "Poziția mea",
  },
  header: {
    productChip: "GlideWeather",
    headline: "GlideWeather",
    intro:
      "Consolă meteo pentru piloți parapantă: vânt, rafale, vizibilitate, instabilitate și fereastră de lansare citite ca un singur semnal.",
    refreshTooltip: "Recalibrează datele meteo",
    refresh: "Recalibrează",
    locationCommand: "Comandă locație",
    minimumCharacters: "minim 3 caractere",
    searchLabel: "Caută zonă / localitate",
    searchPlaceholder: "Brașov, Bunloc, Clopotiva...",
    searchLoading: "Scanez harta...",
    searchEmpty: "Nicio zonă găsită",
  },
  tabs: {
    now: "Acum",
  },
  current: {
    loadError: (message: string) =>
      `Datele meteo live nu au putut fi încărcate: ${message}`,
    eyebrow: "scanare live",
    title: "Răspuns curent",
  },
  forecast: {
    loadError: (message: string) =>
      `Prognoza nu a putut fi încărcată: ${message}`,
    bestWindow: "Cea mai bună fereastră",
  },
  empty: {
    standby: "sistem în așteptare",
    title: "Calibrează zona de zbor",
    body:
      "Introdu o localitate, o zonă de decolare sau activează poziția. Aplicația va sintetiza condițiile într-un verdict de lansare, cu riscurile critice la vedere.",
    wind: "Vânt",
    gusts: "Rafale",
    visibility: "Vizibilitate",
    uncalibrated: "necalibrat",
    detectPosition: "Detectează poziția",
    privacy: "Coordonatele sunt folosite doar pentru prognoza meteo.",
  },
  decision: {
    noCriticalReasons: "Nu există motive critice raportate.",
    sample: "Eșantion",
    wind: "Vânt",
    gust: "Rafală",
    disclaimer:
      "Ajutor de decizie, nu autorizare de zbor. Confirmă vântul real la decolare, rotorul, dezvoltarea convectivă, regulile zonei și limitele tale de pilot.",
  },
  atmosphere: {
    telemetry: "telemetrie atmosferă",
    grid: (elevation: string) => `grid ${elevation}`,
    updatedAt: (time: string) => `Actualizat la ${time}, ora locală`,
    temperature: "Temperatură",
    direction: "Direcție",
    gustSpread: "Spread rafale",
    modelNote:
      "Modelul citește vântul la 10 m. Dacă valea, creasta sau briza termică diferă, prioritatea rămâne măsurarea reală din teren.",
  },
  daily: {
    summary: "sumar zi",
    profile:
      "Profilul zilei pentru deplasare, briefing și alegerea ferestrei de lansare.",
    temperature: "Temperatură",
    maxWind: "Vânt max.",
    maxGust: "Rafală max.",
    rainRisk: "Risc ploaie",
    totalRain: "Ploaie total",
    maxUv: "UV max.",
    sunrise: "Răsărit",
    sunset: "Apus",
  },
  metrics: {
    wind: "Vânt",
    gusts: "Rafale",
    precipitation: "Precipitații",
    visibility: "Vizibilitate",
    clouds: "Nori",
    thermal: "Termic",
    pressure: "Presiune",
    airSun: "Aer + soare",
    atTenMeters: (direction: string) => `${direction} la 10 m`,
    spread: (value: string) => `spread ${value}`,
    probability: (value: string) => `probabilitate ${value}`,
    cape: (value: string) => `CAPE ${value}`,
    feelsLike: (value: string) => `resimțit ${value}`,
    humidity: (value: string) => `umiditate ${value}`,
    uv: (value: string) => `UV ${value}`,
    aqi: (value: number) => `AQI ${Math.round(value)}`,
    pm25: (value: string) => `PM2.5 ${value}`,
  },
  scanner: {
    title: "ferestre de lansare",
    subtitle: "orele de lumină sortate după scor și risc",
    empty:
      "Nicio oră cu lumină nu trece de filtrele conservatoare pentru vânt, vreme și vizibilitate.",
    windGust: (wind: string, gust: string) => `Vânt ${wind} / rafală ${gust}`,
    rain: (risk: string) => `ploaie ${risk}`,
  },
  weather: {
    titles: {
      good: "Poți zbura",
      marginal: "La limită",
      noGo: "Nu zbura",
      noLight: "Fără lumină de zbor",
    },
    reasons: {
      noLightAtArea: "Nu este lumină naturală la zona de zbor.",
      windUnavailable: "Viteza vântului nu este disponibilă.",
      windTooWeak: "Vântul este prea slab pentru o lansare previzibilă la picior.",
      windWeakVariable: "Vântul este slab și poate deveni variabil.",
      windTooStrong:
        "Vântul susținut depășește o limită conservatoare pentru parapantă.",
      windNearComfortLimit:
        "Vântul susținut este aproape de limita superioară de confort.",
      gustUnavailable: "Datele despre rafale nu sunt disponibile.",
      gustTooStrong:
        "Rafalele sunt prea puternice pentru o decizie conservatoare de lansare.",
      gustElevated: "Rafalele sunt ridicate.",
      spreadLarge:
        "Diferența dintre vânt și rafale este mare, semn de aer turbulent sau instabil.",
      spreadAttention: "Diferența dintre vânt și rafale merită atenție.",
      activePrecipitation: "Sunt precipitații active.",
      precipitationLikely: "Probabilitatea de precipitații este ridicată.",
      rainRiskRelevant: "Riscul de ploaie este relevant.",
      thunderstormRisk: "Există risc de furtună.",
      heavyPrecipitation:
        "Prognoza include precipitații puternice sau ninsoare.",
      weatherMayReduce: (label: string) =>
        `${label} poate reduce siguranța lansării.`,
      visibilityUnder5: "Vizibilitatea este sub 5 km.",
      visibilityUnder10: "Vizibilitatea este sub 10 km.",
      capeHigh: "CAPE este ridicat, cu risc de instabilitate convectivă.",
      capePossible: "CAPE sugerează dezvoltare convectivă posibilă.",
      cloudCoverHigh: "Acoperirea noroasă este foarte mare.",
      airQualityVeryPoor: "Calitatea aerului este foarte slabă.",
      airQualityUnhealthy:
        "Calitatea aerului este nesănătoasă pentru efort prelungit.",
      uvHigh: "Expunerea UV este ridicată.",
      good:
        "Vântul, rafalele, precipitațiile, vizibilitatea și instabilitatea arată acceptabil.",
      noLightForecast:
        "Prognoza nu a returnat ore cu lumină naturală pentru data selectată.",
    },
    codes: {
      clearSky: "Cer senin",
      mainlyClear: "Predominant senin",
      partlyCloudy: "Parțial noros",
      overcast: "Înnorat",
      fog: "Ceață",
      drizzle: "Burniță",
      freezingDrizzle: "Burniță înghețată",
      rain: "Ploaie",
      heavyRain: "Ploaie puternică",
      freezingRain: "Ploaie înghețată",
      snow: "Ninsoare",
      snowGrains: "Grăunțe de zăpadă",
      showers: "Averse",
      snowShowers: "Averse de zăpadă",
      thunderstorm: "Furtună",
      thunderstormHail: "Furtună cu grindină",
      unavailable: "Cod meteo indisponibil",
    },
  },
  directions: {
    n: "N",
    ne: "NE",
    e: "E",
    se: "SE",
    s: "S",
    sw: "SV",
    w: "V",
    nw: "NV",
  },
  console: {
    noPlace: "Nicio zonă selectată",
    update: "Actualizează",
    romaniaSites: "Zone din România",
    windowsError: (message: string) =>
      `Ferestrele de azi nu au putut fi încărcate: ${message}`,
    moreData: "Mai multe date",
    rain: "Ploaie",
    spread: "Spread",
    cape: "CAPE",
    humidity: "Umiditate",
    uv: "UV",
    aqi: "AQI",
    pm25: "PM2.5",
    windowsTitle: "Ferestre de lansare",
    windowsSubtitle: "Orele de lumină sortate după scor",
    footer:
      "GlideWeather · Date Open-Meteo · Ajutor de decizie, nu autorizare de zbor.",
  },
} satisfies LocaleText;
