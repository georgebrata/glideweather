"use client";

import AirIcon from "@mui/icons-material/Air";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeIcon from "@mui/icons-material/LightMode";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PlaceIcon from "@mui/icons-material/Place";
import RefreshIcon from "@mui/icons-material/Refresh";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, createTheme, type Theme, useTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { LEGACY_THEME_STORAGE_KEY, PRODUCT_NAME, THEME_STORAGE_KEY } from "../brand";
import {
  DEFAULT_LOCALE,
  EUROPEAN_LOCALE_OPTIONS,
  getIntlLocale,
  getLocaleButtonLabel,
  getLocaleOption,
  getLocaleOptionLabel,
  getTranslations,
  isAppLocale,
  type AppLocale,
  type LocaleText,
} from "../i18n";
import {
  CurrentSnapshot,
  DayForecast,
  FlightStatus,
  FlightVerdict,
  LocationChoice,
  WeatherSample,
  dateForOffset,
  fetchCurrentSnapshot,
  fetchDayForecast,
  formatDateLabel,
  formatTime,
  numberLabel,
  percentLabel,
  searchLocations,
  windDirectionLabel,
} from "../lib/weather";

type ThemeMode = "dark" | "light";

const LOCALE_STORAGE_KEY = "parapantabil-locale";
const themeModeListeners = new Set<() => void>();
const localeListeners = new Set<() => void>();
let memoryThemeMode: ThemeMode | null = null;
let memoryLocale: AppLocale | null = null;
let legacyThemeMigrated = false;

type LocaleContextValue = {
  locale: AppLocale;
  t: LocaleText;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function useLocaleText() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("LocaleContext is missing");
  }
  return value;
}

const POPULAR_SPOTS: LocationChoice[] = [
  { id: "spot-bunloc", name: "Bunloc", detail: "Săcele, Brașov", latitude: 45.5883, longitude: 25.6421, source: "search" },
  { id: "spot-clopotiva", name: "Clopotiva", detail: "Retezat, Hunedoara", latitude: 45.4742, longitude: 22.8053, source: "search" },
  { id: "spot-postavarul", name: "Postăvarul", detail: "Poiana Brașov", latitude: 45.5681, longitude: 25.5632, source: "search" },
  { id: "spot-sirnea", name: "Șirnea", detail: "Piatra Craiului, Brașov", latitude: 45.4672, longitude: 25.2501, source: "search" },
  { id: "spot-pralea", name: "Pralea", detail: "Căiuți, Bacău", latitude: 46.1681, longitude: 26.8382, source: "search" },
  { id: "spot-rimetea", name: "Rimetea", detail: "Piatra Secuiului, Alba", latitude: 46.4523, longitude: 23.5674, source: "search" },
];

type StatusTone = {
  color: string;
  dim: string;
};

const toneByMode: Record<ThemeMode, Record<FlightStatus, StatusTone>> = {
  dark: {
    good: { color: "#4dffa5", dim: "rgba(77, 255, 165, 0.14)" },
    marginal: { color: "#ffd166", dim: "rgba(255, 209, 102, 0.15)" },
    "no-go": { color: "#ff5c7a", dim: "rgba(255, 92, 122, 0.15)" },
  },
  light: {
    good: { color: "#047857", dim: "rgba(4, 120, 87, 0.13)" },
    marginal: { color: "#a16207", dim: "rgba(161, 98, 7, 0.14)" },
    "no-go": { color: "#be123c", dim: "rgba(190, 18, 60, 0.13)" },
  },
};

function createAppTheme(mode: ThemeMode) {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? "#087f82" : "#61f4de",
        contrastText: isLight ? "#ffffff" : "#041116",
      },
      secondary: { main: isLight ? "#b97800" : "#ffd166" },
      error: { main: isLight ? "#c93858" : "#ff5c7a" },
      success: { main: isLight ? "#087f5b" : "#4dffa5" },
      warning: { main: isLight ? "#ad7300" : "#ffd166" },
      background: {
        default: isLight ? "#f6fbff" : "#04070f",
        paper: isLight ? "#ffffff" : "#0d1524",
      },
      text: {
        primary: isLight ? "#102033" : "#f5fbff",
        secondary: isLight ? "#526579" : "#9fb2c5",
      },
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontSize: "1.5rem", lineHeight: 1.2, fontWeight: 700, letterSpacing: 0 },
      h2: { fontSize: "1.75rem", lineHeight: 1.2, fontWeight: 700, letterSpacing: 0 },
      h3: { fontSize: "1.25rem", lineHeight: 1.25, fontWeight: 700, letterSpacing: 0 },
      body1: { lineHeight: 1.5 },
      body2: { lineHeight: 1.45 },
      button: { textTransform: "none", fontWeight: 650, letterSpacing: 0 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: isLight ? "#f6fbff" : "#04070f",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            minHeight: 40,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            color: isLight ? "#526579" : "#9fb2c5",
            fontWeight: 650,
            minHeight: 40,
            textTransform: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              background: isLight ? "#ffffff" : "#0d1524",
            },
          },
        },
      },
    },
  });
}

function statusTone(status: FlightStatus, mode: Theme["palette"]["mode"]) {
  return toneByMode[mode][status];
}

function readStoredThemeMode(): ThemeMode | null {
  try {
    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedMode === "dark" || storedMode === "light") return storedMode;

    const legacyMode = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (legacyMode !== "dark" && legacyMode !== "light") return null;

    if (!legacyThemeMigrated) {
      legacyThemeMigrated = true;
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, legacyMode);
      } catch {
        // Reading the legacy theme still applies it when the new key cannot be written.
      }
    }
    return legacyMode;
  } catch {
    return null;
  }
}

function readInitialThemeMode(): ThemeMode {
  if (memoryThemeMode) return memoryThemeMode;
  if (typeof window === "undefined") return "dark";

  return (
    readStoredThemeMode() ??
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
  );
}

function subscribeThemeMode(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  themeModeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === LEGACY_THEME_STORAGE_KEY) listener();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    themeModeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getServerThemeMode(): ThemeMode {
  return "dark";
}

function writeThemeMode(mode: ThemeMode) {
  memoryThemeMode = mode;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Theme persistence is a convenience; the UI still works without storage.
  }

  themeModeListeners.forEach((listener) => listener());
}

function panelSx(theme: Theme) {
  return {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
    borderRadius: 1,
    backgroundColor: theme.palette.background.paper,
  };
}

function gustSpreadOf(sample: WeatherSample) {
  if (sample.windSpeed === null || sample.windGusts === null) return null;
  return sample.windGusts - sample.windSpeed;
}

function distanceLabel(value: number | null, locale: AppLocale) {
  if (value === null) return getTranslations(locale).common.notAvailable;
  return `${new Intl.NumberFormat(getIntlLocale(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 1000)} km`;
}

function readInitialLocale(): AppLocale {
  if (memoryLocale) return memoryLocale;
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isAppLocale(storedLocale)) return storedLocale;

    const browserLocale = window.navigator.languages.find(isAppLocale);
    return browserLocale ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function subscribeLocale(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  localeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY) listener();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    localeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getServerLocale(): AppLocale {
  return DEFAULT_LOCALE;
}

function writeLocale(locale: AppLocale) {
  memoryLocale = locale;

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Locale persistence is optional; the selected language still applies in memory.
  }

  localeListeners.forEach((listener) => listener());
}

export default function WindWatchApp() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 1000 * 60 * 8 },
        },
      }),
  );
  const themeMode = useSyncExternalStore(
    subscribeThemeMode,
    readInitialThemeMode,
    getServerThemeMode,
  );
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);
  const locale = useSyncExternalStore(subscribeLocale, readInitialLocale, getServerLocale);
  const t = useMemo(() => getTranslations(locale), [locale]);
  const setLocale = useCallback((nextLocale: AppLocale) => {
    writeLocale(nextLocale);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
    document.documentElement.lang = t.meta.documentLang;
  }, [t.meta.documentLang, themeMode]);

  const toggleThemeMode = useCallback(() => {
    writeThemeMode(themeMode === "dark" ? "light" : "dark");
  }, [themeMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocaleContext.Provider value={{ locale, t }}>
          <WindWatchDashboard
            locale={locale}
            setLocale={setLocale}
            themeMode={themeMode}
            toggleThemeMode={toggleThemeMode}
          />
        </LocaleContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function WindWatchDashboard({
  locale,
  setLocale,
  themeMode,
  toggleThemeMode,
}: {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}) {
  const { t } = useLocaleText();
  const [location, setLocation] = useState<LocationChoice | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<"unavailable" | "denied" | null>(null);
  const localeRef = useRef(locale);
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);
  const [searchText, setSearchText] = useState("");

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationNotice("unavailable");
      setLocation(null);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          id: `gps-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
          name: getTranslations(localeRef.current).location.currentPosition,
          detail: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
          latitude,
          longitude,
          source: "gps",
        });
        setLocationNotice(null);
        setActiveTab(0);
        setLocating(false);
      },
      () => {
        setLocationNotice(
          "denied",
        );
        setLocation(null);
        setActiveTab(0);
        setLocating(false);
      },
      { enableHighAccuracy: false, maximumAge: 1000 * 60 * 10, timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(requestLocation, 0);
    return () => window.clearTimeout(timer);
  }, [requestLocation]);

  const currentQuery = useQuery({
    queryKey: ["current-weather", location?.latitude, location?.longitude, locale],
    queryFn: () => fetchCurrentSnapshot(location as LocationChoice, locale),
    enabled: Boolean(location),
    refetchInterval: 1000 * 60 * 12,
  });

  const searchQuery = useQuery({
    queryKey: ["location-search", searchText, locale],
    queryFn: () => searchLocations(searchText, locale),
    enabled: searchText.trim().length >= 3,
    staleTime: 1000 * 60 * 20,
  });

  const selectLocation = useCallback((next: LocationChoice) => {
    setLocation(next);
    setLocationNotice(null);
    setActiveTab(0);
    setSearchText("");
  }, []);

  return (
    <Box
      component="main"
      sx={(theme) => ({
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: "text.primary",
      })}
    >
      <Stack spacing={2} sx={{ mx: "auto", maxWidth: 1100, px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
        <AppHeader
          isFetching={currentQuery.isFetching}
          locating={locating}
          location={location}
          onRefresh={() => currentQuery.refetch()}
          onRequestLocation={requestLocation}
          onSelectLocation={selectLocation}
          searchData={searchQuery.data ?? []}
          searchFetching={searchQuery.isFetching}
          searchText={searchText}
          setSearchText={setSearchText}
          snapshot={currentQuery.data}
          locale={locale}
          setLocale={setLocale}
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}
        />

        {locationNotice ? (
          <Alert severity="warning" onClose={() => setLocationNotice(null)} sx={alertSx("warning")}>
            {locationNotice === "unavailable" ? t.location.unavailable : t.location.permissionDenied}
          </Alert>
        ) : null}

        {locating && !location ? <LoadingBlock /> : null}

        {location ? (
          <WeatherPanels
            activeTab={activeTab}
            currentQuery={currentQuery}
            locating={locating}
            location={location}
            setActiveTab={setActiveTab}
          />
        ) : null}

        <Typography variant="body2" sx={{ color: "text.secondary", pt: 1 }}>
          {t.console.footer}
        </Typography>
      </Stack>
    </Box>
  );
}

function AppHeader({
  isFetching,
  locating,
  location,
  onRefresh,
  onRequestLocation,
  onSelectLocation,
  searchData,
  searchFetching,
  searchText,
  setSearchText,
  snapshot,
  locale,
  setLocale,
  themeMode,
  toggleThemeMode,
}: {
  isFetching: boolean;
  locating: boolean;
  location: LocationChoice | null;
  onRefresh: () => void;
  onRequestLocation: () => void;
  onSelectLocation: (location: LocationChoice) => void;
  searchData: LocationChoice[];
  searchFetching: boolean;
  searchText: string;
  setSearchText: (value: string) => void;
  snapshot?: CurrentSnapshot;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}) {
  const { t } = useLocaleText();
  const themeToggleLabel = themeMode === "dark" ? t.theme.enableLight : t.theme.enableDark;

  return (
    <Stack component="header" spacing={1.5}>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          alignItems: "center",
          gridTemplateColumns: { xs: "1fr auto", md: "auto minmax(280px, 1fr) auto" },
          gridTemplateAreas: {
            xs: `"brand theme" "search search"`,
            md: `"brand search theme"`,
          },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ gridArea: "brand", alignItems: "center", minWidth: 0 }}>
          <LogoMark />
          <Typography component="h1" variant="h1" noWrap>
            {PRODUCT_NAME}
          </Typography>
        </Stack>

        <Autocomplete
          sx={{ gridArea: "search" }}
          fullWidth
          clearText={t.language.clear}
          closeText={t.language.close}
          filterOptions={(options) => options}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : [option.name, option.detail].filter(Boolean).join(", ")
          }
          inputValue={searchText}
          loading={searchFetching}
          loadingText={t.header.searchLoading}
          noOptionsText={t.header.searchEmpty}
          onChange={(_, nextValue) => {
            if (nextValue && typeof nextValue !== "string") onSelectLocation(nextValue);
          }}
          onInputChange={(_, nextValue) => setSearchText(nextValue)}
          openText={t.language.open}
          options={searchData}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t.header.searchLabel}
              placeholder={t.header.searchPlaceholder}
            />
          )}
        />

        <Stack direction="row" spacing={1} sx={{ gridArea: "theme", justifySelf: "end", alignItems: "center" }}>
          <LanguagePicker locale={locale} setLocale={setLocale} t={t} />
          <Tooltip title={themeToggleLabel}>
            <IconButton
              aria-label={themeToggleLabel}
              onClick={toggleThemeMode}
              sx={(theme) => ({
                border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
                color: "primary.main",
              })}
            >
              {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
          {location ? (
            <Chip icon={<PlaceIcon />} label={location.name} variant="outlined" />
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t.console.noPlace}
            </Typography>
          )}
          {snapshot ? (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {formatTime(snapshot.sample.time, snapshot.timezone, locale)}
            </Typography>
          ) : null}
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button
            variant="contained"
            startIcon={locating ? <CircularProgress size={16} color="inherit" /> : <MyLocationIcon />}
            onClick={onRequestLocation}
            disabled={locating}
          >
            {t.location.myPosition}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={!location || isFetching}
          >
            {t.console.update}
          </Button>
        </Stack>
      </Stack>

      <SiteShortcuts location={location} onSelectLocation={onSelectLocation} />
    </Stack>
  );
}

function SiteShortcuts({
  location,
  onSelectLocation,
}: {
  location: LocationChoice | null;
  onSelectLocation: (location: LocationChoice) => void;
}) {
  const { t } = useLocaleText();
  const buttons = (
    <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: "wrap" }}>
      {POPULAR_SPOTS.map((spot) => {
        const selected = location?.id === spot.id;
        return (
          <Button
            key={spot.id}
            variant="text"
            aria-pressed={selected}
            onClick={() => onSelectLocation(spot)}
            sx={{
              minHeight: 36,
              px: 1.1,
              color: selected ? "primary.main" : "text.primary",
              fontWeight: selected ? 700 : 500,
            }}
          >
            {spot.name}
          </Button>
        );
      })}
    </Stack>
  );

  if (!location) return buttons;

  return (
    <Accordion disableGutters elevation={0} sx={accordionSx}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id="romania-sites-header" aria-controls="romania-sites">
        <Typography sx={{ fontWeight: 700 }}>{t.console.romaniaSites}</Typography>
      </AccordionSummary>
      <AccordionDetails id="romania-sites">{buttons}</AccordionDetails>
    </Accordion>
  );
}

function WeatherPanels({
  activeTab,
  currentQuery,
  locating,
  location,
  setActiveTab,
}: {
  activeTab: number;
  currentQuery: ReturnType<typeof useQuery<CurrentSnapshot, Error>>;
  locating: boolean;
  location: LocationChoice;
  setActiveTab: (value: number) => void;
}) {
  const { locale, t } = useLocaleText();

  return (
    <Stack spacing={2}>
      <Tabs
        value={activeTab}
        onChange={(_, nextValue: number) => setActiveTab(nextValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={(theme) => ({
          minHeight: 40,
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTabs-flexContainer": { gap: 0.5 },
          "& .MuiTab-root.Mui-selected": {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
          },
        })}
      >
        <Tab label={t.tabs.now} value={0} />
        {[1, 2, 3].map((offset) => (
          <Tab key={offset} label={formatDateLabel(dateForOffset(offset), locale)} value={offset} />
        ))}
      </Tabs>

      {activeTab === 0 ? (
        <CurrentDay
          currentQuery={currentQuery}
          locating={locating}
          location={location}
        />
      ) : null}

      {[1, 2, 3].map((offset) => (
        <ForecastPanel key={offset} active={activeTab === offset} location={location} offset={offset} />
      ))}
    </Stack>
  );
}

function CurrentPanel({
  snapshot,
  detailSample,
  isLoading,
  isFetching,
  queryError,
}: {
  snapshot?: CurrentSnapshot;
  detailSample?: WeatherSample;
  isLoading: boolean;
  isFetching: boolean;
  queryError: Error | null;
}) {
  const { t } = useLocaleText();

  if (queryError) {
    return (
      <Alert severity="error" sx={alertSx("error")}>
        {t.current.loadError(queryError.message)}
      </Alert>
    );
  }

  if (isLoading || !snapshot || !detailSample) return <LoadingBlock />;

  return (
    <Stack spacing={2}>
      {isFetching ? <LinearProgress color="primary" /> : null}
      <VerdictPanel sample={snapshot.sample} verdict={snapshot.verdict} />
      <DetailRow sample={detailSample} timezone={snapshot.timezone} />
    </Stack>
  );
}

function CurrentDay({
  currentQuery,
  locating,
  location,
}: {
  currentQuery: ReturnType<typeof useQuery<CurrentSnapshot, Error>>;
  locating: boolean;
  location: LocationChoice;
}) {
  const { locale, t } = useLocaleText();
  const date = useMemo(() => dateForOffset(0), []);
  const forecastQuery = useQuery({
    queryKey: ["day-forecast", location.latitude, location.longitude, date, locale],
    queryFn: () => fetchDayForecast(location, date, locale),
  });
  const snapshot = currentQuery.data;
  const detailSample = useMemo(() => {
    if (!snapshot) return undefined;
    if (snapshot.sample.precipitationProbability !== null) return snapshot.sample;
    const hour = snapshot.sample.time.slice(0, 13);
    const match = forecastQuery.data?.samples.find((sample) => sample.time.slice(0, 13) === hour);
    if (!match) return snapshot.sample;
    return { ...snapshot.sample, precipitationProbability: match.precipitationProbability };
  }, [forecastQuery.data, snapshot]);

  return (
    <Stack spacing={2}>
      <CurrentPanel
        queryError={currentQuery.error}
        snapshot={snapshot}
        detailSample={detailSample}
        isLoading={currentQuery.isLoading || locating}
        isFetching={currentQuery.isFetching}
      />
      {forecastQuery.error ? (
        <Alert severity="error" sx={alertSx("error")}>
          {t.console.windowsError(forecastQuery.error.message)}
        </Alert>
      ) : forecastQuery.isLoading || !forecastQuery.data ? (
        <Skeleton variant="rounded" height={88} />
      ) : (
        <LaunchWindowScanner forecast={forecastQuery.data} />
      )}
      {detailSample ? <ExtraMetrics sample={detailSample} /> : null}
    </Stack>
  );
}

function ForecastPanel({
  active,
  location,
  offset,
}: {
  active: boolean;
  location: LocationChoice;
  offset: number;
}) {
  const { locale, t } = useLocaleText();
  const date = useMemo(() => dateForOffset(offset), [offset]);
  const forecastQuery = useQuery({
    queryKey: ["day-forecast", location.latitude, location.longitude, date, locale],
    queryFn: () => fetchDayForecast(location, date, locale),
    enabled: active,
  });

  if (!active) return null;
  if (forecastQuery.error) {
    return (
      <Alert severity="error" sx={alertSx("error")}>
        {t.forecast.loadError(forecastQuery.error.message)}
      </Alert>
    );
  }
  if (forecastQuery.isLoading || !forecastQuery.data) return <LoadingBlock />;

  const forecast = forecastQuery.data;
  const sample = forecast.best.sample;

  return (
    <Stack spacing={2}>
      <DailySummary forecast={forecast} />
      <VerdictPanel
        contextTitle={t.forecast.bestWindow}
        sample={sample}
        verdict={forecast.best.verdict}
      />
      {sample ? <DetailRow sample={sample} timezone={forecast.timezone} /> : null}
      <LaunchWindowScanner forecast={forecast} />
      {sample ? <ExtraMetrics sample={sample} /> : null}
    </Stack>
  );
}

function DailySummary({ forecast }: { forecast: DayForecast }) {
  const { locale, t } = useLocaleText();
  const parts = [
    `${t.daily.temperature} ${numberLabel(forecast.daily.temperatureMin, "C", 0, locale)} / ${numberLabel(forecast.daily.temperatureMax, "C", 0, locale)}`,
    `${t.daily.maxWind} ${numberLabel(forecast.daily.windSpeedMax, "km/h", 0, locale)}`,
    `${t.daily.maxGust} ${numberLabel(forecast.daily.windGustsMax, "km/h", 0, locale)}`,
    `${t.console.rain} ${percentLabel(forecast.daily.precipitationProbabilityMax, locale)}`,
    `${formatTime(forecast.daily.sunrise, forecast.timezone, locale)}–${formatTime(forecast.daily.sunset, forecast.timezone, locale)}`,
  ];

  return (
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {parts.join(" · ")}
    </Typography>
  );
}

function VerdictPanel({
  contextTitle,
  sample,
  verdict,
}: {
  contextTitle?: string;
  sample: WeatherSample | null;
  verdict: FlightVerdict;
}) {
  const theme = useTheme();
  const { locale, t } = useLocaleText();
  const tone = statusTone(verdict.status, theme.palette.mode);
  const unavailable = t.common.notAvailable;
  const reasons = verdict.reasons.slice(0, 2);

  return (
    <Box sx={(panelTheme) => ({ ...panelSx(panelTheme), p: { xs: 2, md: 2.5 } })}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "148px 1fr" },
          alignItems: "center",
        }}
      >
        <ScoreOrb score={verdict.score} status={verdict.status} />
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          {contextTitle ? (
            <Typography component="h2" variant="h3">
              {contextTitle}
            </Typography>
          ) : null}
          <Chip
            component={contextTitle ? "div" : "h2"}
            label={verdict.title}
            variant="outlined"
            sx={{
              m: 0,
              alignSelf: "flex-start",
              height: "auto",
              py: 0.45,
              color: tone.color,
              backgroundColor: tone.dim,
              borderColor: tone.color,
              "& .MuiChip-label": {
                fontSize: "1.75rem",
                fontWeight: 700,
                lineHeight: 1.2,
                whiteSpace: "normal",
                px: 1.25,
              },
            }}
          />
          {reasons.map((reason) => (
            <RiskLine key={reason} color={tone.color}>
              {reason}
            </RiskLine>
          ))}
          <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Fact icon={<AirIcon fontSize="small" />} label={t.decision.wind} value={sample ? numberLabel(sample.windSpeed, "km/h", 0, locale) : unavailable} />
            <Fact icon={<SpeedIcon fontSize="small" />} label={t.decision.gust} value={sample ? numberLabel(sample.windGusts, "km/h", 0, locale) : unavailable} />
            <Fact label={t.console.spread} value={sample ? numberLabel(gustSpreadOf(sample), "km/h", 0, locale) : unavailable} />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

function DetailRow({ sample, timezone }: { sample: WeatherSample; timezone: string }) {
  const { locale, t } = useLocaleText();

  return (
    <Box sx={(theme) => ({ ...panelSx(theme), p: { xs: 2, md: 2.5 } })}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "168px 1fr" },
          alignItems: "center",
        }}
      >
        <WindDial sample={sample} />
        <Stack spacing={1.25}>
          <Box>
            <Typography component="h3" variant="h3">
              {sample.weatherLabel}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.4 }}>
              {t.atmosphere.updatedAt(formatTime(sample.time, timezone, locale))}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: 1.25,
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, minmax(0, 1fr))" },
            }}
          >
            <Fact label={t.atmosphere.direction} value={windDirectionLabel(sample.windDirection, locale)} />
            <Fact label={t.atmosphere.temperature} value={numberLabel(sample.temperature, "C", 1, locale)} />
            <Fact label={t.metrics.visibility} value={distanceLabel(sample.visibility, locale)} />
            <Fact label={t.console.rain} value={percentLabel(sample.precipitationProbability, locale)} />
            <Fact label={t.console.cape} value={numberLabel(sample.cape, "J/kg", 0, locale)} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

function LaunchWindowScanner({ forecast }: { forecast: DayForecast }) {
  const theme = useTheme();
  const { locale, t } = useLocaleText();

  return (
    <Stack spacing={1.25}>
      <Box>
        <Typography component="h3" variant="h3">
          {t.console.windowsTitle}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.4 }}>
          {t.console.windowsSubtitle}
        </Typography>
      </Box>
      {forecast.topWindows.length === 0 ? (
        <Alert severity="warning" sx={alertSx("warning")}>
          {t.scanner.empty}
        </Alert>
      ) : (
        <Stack spacing={1}>
          {forecast.topWindows.map(({ sample, verdict }) => {
            const tone = statusTone(verdict.status, theme.palette.mode);
            return (
              <Box
                key={sample.time}
                sx={(rowTheme) => ({
                  ...panelSx(rowTheme),
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: { xs: "1fr", md: "88px minmax(140px, 180px) 1fr 1fr" },
                  alignItems: "center",
                  p: 1.25,
                })}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {formatTime(sample.time, forecast.timezone, locale)}
                </Typography>
                <Box>
                  <Typography variant="body2" sx={{ color: tone.color, fontWeight: 700 }}>
                    {verdict.title}
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.6,
                      height: 6,
                      borderRadius: 999,
                      backgroundColor: alpha(theme.palette.text.primary, 0.08),
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${verdict.score}%`,
                        height: "100%",
                        backgroundColor: tone.color,
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {t.scanner.windGust(
                    numberLabel(sample.windSpeed, "km/h", 0, locale),
                    numberLabel(sample.windGusts, "km/h", 0, locale),
                  )}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {sample.weatherLabel}, {t.scanner.rain(percentLabel(sample.precipitationProbability, locale))}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

function ExtraMetrics({ sample }: { sample: WeatherSample }) {
  const { locale, t } = useLocaleText();
  const items = [
    { label: t.metrics.pressure, value: numberLabel(sample.pressure, "hPa", 0, locale) },
    { label: t.console.humidity, value: percentLabel(sample.humidity, locale) },
    { label: t.metrics.clouds, value: percentLabel(sample.cloudCover, locale) },
    { label: t.console.uv, value: numberLabel(sample.uvIndex, "", 1, locale) },
    { label: t.console.aqi, value: sample.usAqi === null ? t.common.notAvailable : String(Math.round(sample.usAqi)) },
    { label: t.console.pm25, value: numberLabel(sample.pm25, "ug/m3", 1, locale) },
  ];

  return (
    <Accordion disableGutters elevation={0} sx={accordionSx}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id="more-metrics-header" aria-controls="more-metrics">
        <Typography sx={{ fontWeight: 700 }}>{t.console.moreData}</Typography>
      </AccordionSummary>
      <AccordionDetails id="more-metrics">
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, minmax(0, 1fr))" },
          }}
        >
          {items.map((item) => (
            <Fact key={item.label} label={item.label} value={item.value} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

function ScoreOrb({ score, status }: { score: number; status: FlightStatus }) {
  const theme = useTheme();
  const { t } = useLocaleText();
  const tone = statusTone(status, theme.palette.mode);
  const angle = Math.max(0, Math.min(360, Math.round(score * 3.6)));

  return (
    <Box
      aria-label={t.common.scoreOutOf100(score)}
      role="img"
      sx={{
        width: 148,
        height: 148,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        mx: { xs: "auto", sm: 0 },
        position: "relative",
        background: `conic-gradient(${tone.color} 0deg ${angle}deg, ${alpha(theme.palette.text.primary, 0.1)} ${angle}deg 360deg)`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 10,
          borderRadius: "50%",
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Stack spacing={0.2} sx={{ position: "relative", alignItems: "center", zIndex: 1 }}>
        <Typography sx={{ color: tone.color, fontWeight: 700, fontSize: "2.25rem", lineHeight: 1 }}>
          {score}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t.common.scoreDenominator}
        </Typography>
      </Stack>
    </Box>
  );
}

function WindDial({ sample }: { sample: WeatherSample }) {
  const theme = useTheme();
  const { locale, t } = useLocaleText();
  const rotation = sample.windDirection ?? 0;
  const compassPoints = [
    { key: "n", label: t.directions.n },
    { key: "e", label: t.directions.e },
    { key: "s", label: t.directions.s },
    { key: "w", label: t.directions.w },
  ] as const;
  const status: FlightStatus =
    sample.windSpeed !== null && sample.windSpeed >= 8 && sample.windSpeed <= 22
      ? "good"
      : sample.windSpeed !== null && sample.windSpeed > 28
        ? "no-go"
        : "marginal";
  const tone = statusTone(status, theme.palette.mode);

  return (
    <Box
      aria-label={`${t.decision.wind} ${windDirectionLabel(sample.windDirection, locale)} ${numberLabel(sample.windSpeed, "km/h", 0, locale)}`}
      role="img"
      sx={{
        width: 160,
        height: 160,
        borderRadius: "50%",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        backgroundColor: theme.palette.background.paper,
        display: "grid",
        placeItems: "center",
        position: "relative",
        mx: { xs: "auto", sm: 0 },
      }}
    >
      {compassPoints.map((point) => (
        <Typography
          key={point.key}
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            position: "absolute",
            top: point.key === "n" ? 8 : point.key === "s" ? "auto" : "50%",
            bottom: point.key === "s" ? 8 : "auto",
            left: point.key === "w" ? 10 : point.key === "e" ? "auto" : "50%",
            right: point.key === "e" ? 10 : "auto",
            transform: point.key === "n" || point.key === "s" ? "translateX(-50%)" : "translateY(-50%)",
          }}
        >
          {point.label}
        </Typography>
      ))}
      <Box
        sx={{
          width: 6,
          height: 58,
          borderRadius: 999,
          backgroundColor: tone.color,
          transform: `rotate(${rotation}deg) translateY(-20px)`,
          transformOrigin: "center 49px",
          transition: "transform 160ms ease",
          "&::before": {
            content: '""',
            display: "block",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: `14px solid ${tone.color}`,
            transform: "translate(-5px, -12px)",
          },
        }}
      />
      <Stack spacing={0.15} sx={{ position: "absolute", alignItems: "center" }}>
        <Typography sx={{ color: tone.color, fontWeight: 700, fontSize: "1.25rem" }}>
          {windDirectionLabel(sample.windDirection, locale)}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {numberLabel(sample.windSpeed, "km/h", 0, locale)}
        </Typography>
      </Stack>
    </Box>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
        {icon}
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ fontWeight: 700, fontSize: "1.25rem", overflowWrap: "anywhere" }}>
        {value}
      </Typography>
    </Box>
  );
}

function RiskLine({ children, color }: { children: ReactNode; color: string }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "flex-start" }}>
      <WarningAmberIcon sx={{ color, fontSize: 18, mt: "2px" }} />
      <Typography variant="body2">{children}</Typography>
    </Stack>
  );
}

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      aria-hidden
      sx={{ width: size, height: size, display: "block", color: "primary.main", flex: "0 0 auto" }}
    >
      <circle cx="16" cy="16" r="13.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 5.5 L19.2 16 L16 14.1 L12.8 16 Z" fill="currentColor" />
      <circle cx="16" cy="16" r="1.7" fill="currentColor" />
    </Box>
  );
}

function LoadingBlock() {
  return (
    <Stack spacing={1.5}>
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={120} />
    </Stack>
  );
}

function accordionSx(theme: Theme) {
  return {
    ...panelSx(theme),
    backgroundImage: "none",
    "&:before": { display: "none" },
    "&.Mui-expanded": { margin: 0 },
  };
}

function LanguagePicker({
  locale,
  setLocale,
  t,
}: {
  locale: AppLocale;
  setLocale: (value: AppLocale) => void;
  t: LocaleText;
}) {
  const value = getLocaleOption(locale);

  return (
    <Tooltip title={t.language.tooltip}>
      <Autocomplete
        clearText={t.language.clear}
        closeText={t.language.close}
        disableClearable
        filterOptions={(options) => options}
        getOptionKey={(option) => option.code}
        getOptionLabel={getLocaleOptionLabel}
        inputValue={getLocaleButtonLabel(locale)}
        isOptionEqualToValue={(option, nextValue) => option.code === nextValue.code}
        noOptionsText={t.language.noOptions}
        onChange={(_, nextValue) => setLocale(nextValue.code)}
        onInputChange={() => undefined}
        openText={t.language.open}
        options={EUROPEAN_LOCALE_OPTIONS}
        renderInput={(params) => (
          <TextField
            {...params}
            aria-label={t.language.label}
            size="small"
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                startAdornment: (
                  <>
                    <LanguageIcon sx={{ color: "primary.main", fontSize: 18, mr: 0.5 }} />
                    {params.slotProps.input.startAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.code}>
            <Stack spacing={0.15} sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }}>{getLocaleOptionLabel(option)}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {option.countryName} · {option.languageName}
              </Typography>
            </Stack>
          </Box>
        )}
        size="small"
        sx={{
          width: { xs: 118, sm: 168 },
          "& .MuiAutocomplete-input": { minWidth: "0 !important", fontWeight: 650 },
        }}
        value={value}
      />
    </Tooltip>
  );
}

function alertSx(kind: "error" | "warning") {
  return (theme: Theme) => {
    const color = kind === "error" ? theme.palette.error.main : theme.palette.warning.main;
    return {
      border: `1px solid ${color}`,
      backgroundColor: alpha(color, 0.08),
      color: theme.palette.text.primary,
    };
  };
}
