export const en = {
  meta: {
    documentLang: "en",
    localeName: "English",
    nativeName: "English",
    title: "WindWatch · Flight weather",
    description:
      "Launch verdict for paragliding: wind, gusts, visibility, and instability.",
  },
  common: {
    notAvailable: "n/a",
    scoreDenominator: "/100",
    scoreOutOf100: (score: number) => `WindWatch score ${score} out of 100`,
  },
  language: {
    label: "Language",
    tooltip: "Change language",
    clear: "Clear",
    close: "Close",
    open: "Open",
    noOptions: "No European country found",
  },
  theme: {
    enableLight: "Enable light theme",
    enableDark: "Enable dark theme",
  },
  errors: {
    weatherServiceStatus: (status: number) =>
      `The weather service responded with status ${status}`,
  },
  sources: {
    forecast: "Open-Meteo forecast",
    airQuality: "Open-Meteo air quality",
    geocoding: "Open-Meteo map",
    gps: "browser GPS",
  },
  statusTone: {
    good: "good window",
    marginal: "marginal",
    noGo: "do not launch",
  },
  location: {
    unavailable:
      "Browser location is not available. Search for a launch area or town.",
    permissionDenied:
      "Location permission is not enabled. Search manually for a launch area or town.",
    currentPosition: "Current position",
    uncalibratedCoordinates: "Uncalibrated coordinates",
    useBrowserPosition: "Use browser location",
    myPosition: "My position",
  },
  header: {
    productChip: "Parapantabil OS",
    headline: "Parapantabil?",
    intro:
      "Weather console for paraglider pilots: wind, gusts, visibility, instability, and launch window read as one signal.",
    refreshTooltip: "Recalibrate weather data",
    refresh: "Recalibrate",
    locationCommand: "Location command",
    minimumCharacters: "minimum 3 characters",
    searchLabel: "Search area / locality",
    searchPlaceholder: "Brasov, Bunloc, Clopotiva...",
    searchLoading: "Scanning map...",
    searchEmpty: "No area found",
  },
  tabs: {
    now: "Now",
  },
  current: {
    loadError: (message: string) =>
      `Live weather data could not be loaded: ${message}`,
    eyebrow: "live scan",
    title: "Current answer",
  },
  forecast: {
    loadError: (message: string) =>
      `The forecast could not be loaded: ${message}`,
    bestWindow: "Best launch window",
  },
  empty: {
    standby: "system standing by",
    title: "Calibrate the flight area",
    body:
      "Enter a locality, a launch area, or enable location. The console will synthesize the conditions into a paragliding verdict, with critical risks visible.",
    wind: "Wind",
    gusts: "Gusts",
    visibility: "Visibility",
    uncalibrated: "uncalibrated",
    detectPosition: "Detect position",
    privacy: "Coordinates are used only for the weather forecast.",
  },
  decision: {
    noCriticalReasons: "No critical reasons reported.",
    sample: "Sample",
    wind: "Wind",
    gust: "Gust",
    disclaimer:
      "Decision aid, not flight authorization. Confirm the real wind at launch, rotor, convective development, area rules, and your own pilot limits.",
  },
  atmosphere: {
    telemetry: "atmospheric telemetry",
    grid: (elevation: string) => `grid ${elevation}`,
    updatedAt: (time: string) => `Updated at ${time}, local time`,
    temperature: "Temperature",
    direction: "Direction",
    gustSpread: "Gust spread",
    modelNote:
      "The model reads wind at 10 m. If the valley, ridge, or thermal breeze differs, the real field measurement remains the priority.",
  },
  daily: {
    summary: "day summary",
    profile:
      "Day profile for travel, briefing, and launch-window selection.",
    temperature: "Temperature",
    maxWind: "Max wind",
    maxGust: "Max gust",
    rainRisk: "Rain risk",
    totalRain: "Total rain",
    maxUv: "Max UV",
    sunrise: "Sunrise",
    sunset: "Sunset",
  },
  metrics: {
    wind: "Wind",
    gusts: "Gusts",
    precipitation: "Precipitation",
    visibility: "Visibility",
    clouds: "Clouds",
    thermal: "Thermal",
    pressure: "Pressure",
    airSun: "Air + sun",
    atTenMeters: (direction: string) => `${direction} at 10 m`,
    spread: (value: string) => `spread ${value}`,
    probability: (value: string) => `probability ${value}`,
    cape: (value: string) => `CAPE ${value}`,
    feelsLike: (value: string) => `feels like ${value}`,
    humidity: (value: string) => `humidity ${value}`,
    uv: (value: string) => `UV ${value}`,
    aqi: (value: number) => `AQI ${Math.round(value)}`,
    pm25: (value: string) => `PM2.5 ${value}`,
  },
  scanner: {
    title: "launch windows",
    subtitle: "daylight hours sorted by score and risk",
    empty:
      "No daylight hour passes the conservative filters for wind, weather, and visibility.",
    windGust: (wind: string, gust: string) => `Wind ${wind} / gust ${gust}`,
    rain: (risk: string) => `rain ${risk}`,
  },
  weather: {
    titles: {
      good: "You can fly",
      marginal: "Marginal",
      noGo: "Do not fly",
      noLight: "No daylight",
    },
    reasons: {
      noLightAtArea: "There is no natural light at the flight area.",
      windUnavailable: "Wind speed is not available.",
      windTooWeak: "Wind is too weak for a predictable foot launch.",
      windWeakVariable: "Wind is weak and may become variable.",
      windTooStrong:
        "Sustained wind exceeds a conservative paragliding limit.",
      windNearComfortLimit:
        "Sustained wind is close to the upper comfort limit.",
      gustUnavailable: "Gust data is not available.",
      gustTooStrong:
        "Gusts are too strong for a conservative launch decision.",
      gustElevated: "Gusts are elevated.",
      spreadLarge:
        "The wind-to-gust spread is large, a sign of turbulent or unstable air.",
      spreadAttention: "The wind-to-gust spread deserves attention.",
      activePrecipitation: "There is active precipitation.",
      precipitationLikely: "Precipitation probability is high.",
      rainRiskRelevant: "Rain risk is relevant.",
      thunderstormRisk: "There is a thunderstorm risk.",
      heavyPrecipitation:
        "The forecast includes heavy precipitation or snow.",
      weatherMayReduce: (label: string) =>
        `${label} may reduce launch safety.`,
      visibilityUnder5: "Visibility is below 5 km.",
      visibilityUnder10: "Visibility is below 10 km.",
      capeHigh: "CAPE is high, with convective instability risk.",
      capePossible: "CAPE suggests possible convective development.",
      cloudCoverHigh: "Cloud cover is very high.",
      airQualityVeryPoor: "Air quality is very poor.",
      airQualityUnhealthy:
        "Air quality is unhealthy for prolonged exertion.",
      uvHigh: "UV exposure is high.",
      good:
        "Wind, gusts, precipitation, visibility, and instability look acceptable.",
      noLightForecast:
        "The forecast did not return natural-light hours for the selected date.",
    },
    codes: {
      clearSky: "Clear sky",
      mainlyClear: "Mainly clear",
      partlyCloudy: "Partly cloudy",
      overcast: "Overcast",
      fog: "Fog",
      drizzle: "Drizzle",
      freezingDrizzle: "Freezing drizzle",
      rain: "Rain",
      heavyRain: "Heavy rain",
      freezingRain: "Freezing rain",
      snow: "Snow",
      snowGrains: "Snow grains",
      showers: "Showers",
      snowShowers: "Snow showers",
      thunderstorm: "Thunderstorm",
      thunderstormHail: "Thunderstorm with hail",
      unavailable: "Weather code unavailable",
    },
  },
  directions: {
    n: "N",
    ne: "NE",
    e: "E",
    se: "SE",
    s: "S",
    sw: "SW",
    w: "W",
    nw: "NW",
  },
  console: {
    noPlace: "No area selected",
    update: "Update",
    romaniaSites: "Sites in Romania",
    windowsError: (message: string) =>
      `Today's launch windows could not be loaded: ${message}`,
    moreData: "More data",
    rain: "Rain",
    spread: "Spread",
    cape: "CAPE",
    humidity: "Humidity",
    uv: "UV",
    aqi: "AQI",
    pm25: "PM2.5",
    windowsTitle: "Launch windows",
    windowsSubtitle: "Daylight hours sorted by score",
    footer:
      "WindWatch · Open-Meteo data · Decision aid, not flight authorization.",
  },
};

export type LocaleText = typeof en;
