"use client";

import AirIcon from "@mui/icons-material/Air";
import CloudIcon from "@mui/icons-material/Cloud";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import NavigationIcon from "@mui/icons-material/Navigation";
import PlaceIcon from "@mui/icons-material/Place";
import RefreshIcon from "@mui/icons-material/Refresh";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import SensorsIcon from "@mui/icons-material/Sensors";
import SpeedIcon from "@mui/icons-material/Speed";
import TerrainIcon from "@mui/icons-material/Terrain";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import TimelineIcon from "@mui/icons-material/Timeline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CompassCalibrationIcon from "@mui/icons-material/CompassCalibration";
import MapIcon from "@mui/icons-material/Map";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  LinearProgress,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#61f4de" },
    secondary: { main: "#ffd166" },
    error: { main: "#ff5c7a" },
    success: { main: "#4dffa5" },
    warning: { main: "#ffd166" },
    background: { default: "#04070f", paper: "rgba(9, 16, 32, 0.76)" },
    text: { primary: "#f5fbff", secondary: "#9fb2c5" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontSize: "2.6rem", lineHeight: 1.05, fontWeight: 850, letterSpacing: "-0.01em" },
    h2: { fontSize: "1.65rem", lineHeight: 1.15, fontWeight: 780, letterSpacing: "0" },
    h3: { fontSize: "1.05rem", lineHeight: 1.2, fontWeight: 760, letterSpacing: "0" },
    body1: { lineHeight: 1.58 },
    body2: { lineHeight: 1.48 },
    button: { textTransform: "none", fontWeight: 760, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#04070f",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 44,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          borderColor: "rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.07)",
          color: "#dff8ff",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: "#9fb2c5",
          fontWeight: 800,
          minHeight: 46,
          paddingLeft: 16,
          paddingRight: 16,
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            background: "rgba(2, 8, 18, 0.68)",
            minHeight: 48,
          },
        },
      },
    },
  },
});

const defaultSources = [
  "Open-Meteo Forecast",
  "Open-Meteo Air Quality",
  "Open-Meteo Geocoding",
];

const LOGO_SRC = "/parapantabil-logo.png";

// Preset popular flight spots in Romania for 1-click loading
const POPULAR_SPOTS: LocationChoice[] = [
  { id: "spot-bunloc", name: "Bunloc", detail: "Săcele, Brașov", latitude: 45.5883, longitude: 25.6421, source: "search" },
  { id: "spot-clopotiva", name: "Clopotiva", detail: "Retezat, Hunedoara", latitude: 45.4742, longitude: 22.8053, source: "search" },
  { id: "spot-postavarul", name: "Postăvarul", detail: "Poiana Brașov", latitude: 45.5681, longitude: 25.5632, source: "search" },
  { id: "spot-sirnea", name: "Șirnea", detail: "Piatra Craiului, Brașov", latitude: 45.4672, longitude: 25.2501, source: "search" },
  { id: "spot-pralea", name: "Pralea", detail: "Căiuți, Bacău", latitude: 46.1681, longitude: 26.8382, source: "search" },
  { id: "spot-rimetea", name: "Rimetea", detail: "Piatra Secuiului, Alba", latitude: 46.4523, longitude: 23.5674, source: "search" },
];

const toneByStatus: Record<
  FlightStatus,
  {
    color: string;
    dim: string;
    glow: string;
    gradient: string;
    label: string;
  }
> = {
  good: {
    color: "#4dffa5",
    dim: "rgba(77, 255, 165, 0.14)",
    glow: "rgba(77, 255, 165, 0.36)",
    gradient: "linear-gradient(135deg, rgba(77,255,165,0.24), rgba(97,244,222,0.08))",
    label: "fereastră bună",
  },
  marginal: {
    color: "#ffd166",
    dim: "rgba(255, 209, 102, 0.15)",
    glow: "rgba(255, 209, 102, 0.32)",
    gradient: "linear-gradient(135deg, rgba(255,209,102,0.23), rgba(255,121,94,0.08))",
    label: "la limită",
  },
  "no-go": {
    color: "#ff5c7a",
    dim: "rgba(255, 92, 122, 0.15)",
    glow: "rgba(255, 92, 122, 0.34)",
    gradient: "linear-gradient(135deg, rgba(255,92,122,0.24), rgba(255,209,102,0.06))",
    label: "nu lansa",
  },
};

const shellMotion = {
  "@keyframes gridDrift": {
    "0%": { transform: "translate3d(0, 0, 0)" },
    "100%": { transform: "translate3d(42px, 28px, 0)" },
  },
  "@keyframes aurora": {
    "0%, 100%": { opacity: 0.74, transform: "translate3d(-2%, 0, 0) scale(1)" },
    "50%": { opacity: 0.96, transform: "translate3d(2%, -1%, 0) scale(1.025)" },
  },
  "@keyframes scanline": {
    "0%": { transform: "translateY(-100%)" },
    "100%": { transform: "translateY(100%)" },
  },
  "@keyframes orbit": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  "@keyframes breathe": {
    "0%, 100%": { opacity: 0.62, transform: "scale(1)" },
    "50%": { opacity: 1, transform: "scale(1.035)" },
  },
  "@keyframes floatWing": {
    "0%, 100%": { transform: "translate3d(-10px, 2px, 0) rotate(-1deg)" },
    "50%": { transform: "translate3d(14px, -12px, 0) rotate(1deg)" },
  },
  "@keyframes pathPulse": {
    "0%": { strokeDashoffset: 120, opacity: 0 },
    "30%": { opacity: 0.68 },
    "100%": { strokeDashoffset: 0, opacity: 0 },
  },
  "@media (prefers-reduced-motion: reduce)": {
    "*": {
      animationDuration: "0.001ms !important",
      animationIterationCount: "1 !important",
      scrollBehavior: "auto !important",
      transitionDuration: "0.001ms !important",
    },
  },
};

const glassPanel = {
  position: "relative",
  overflow: "hidden",
  border: "1px solid rgba(141, 245, 255, 0.18)",
  borderRadius: 2.5,
  background:
    "linear-gradient(145deg, rgba(10, 20, 38, 0.88), rgba(5, 11, 24, 0.74) 56%, rgba(13, 39, 46, 0.65))",
  boxShadow:
    "0 26px 80px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.09)",
  backdropFilter: "blur(26px)",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.06) 36%, transparent 58%)",
    opacity: 0.56,
  },
};

export default function ParagliderWeatherApp() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 1000 * 60 * 8 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ParagliderWeatherDashboard />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function ParagliderWeatherDashboard() {
  const [location, setLocation] = useState<LocationChoice | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationNotice(
        "Poziția browserului nu este disponibilă. Selectează un loc din listă sau caută o zonă de decolare.",
      );
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          id: `gps-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
          name: "Poziția curentă",
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
          "Permisiunea de localizare nu a fost acordată. Alege un loc popular de zbor sau caută o localitate.",
        );
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
    queryKey: ["current-weather", location?.latitude, location?.longitude],
    queryFn: () => fetchCurrentSnapshot(location as LocationChoice),
    enabled: Boolean(location),
    refetchInterval: 1000 * 60 * 12,
  });

  const searchQuery = useQuery({
    queryKey: ["location-search", searchText],
    queryFn: () => searchLocations(searchText),
    enabled: searchText.trim().length >= 3,
    staleTime: 1000 * 60 * 20,
  });

  const sourceChips = currentQuery.data?.sources ?? defaultSources;

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        color: "text.primary",
        background:
          "radial-gradient(circle at 18% 0%, rgba(97, 244, 222, 0.2), transparent 28%), radial-gradient(circle at 78% 16%, rgba(255, 92, 122, 0.14), transparent 24%), linear-gradient(180deg, #04070f 0%, #07111f 48%, #03060d 100%)",
        isolation: "isolate",
        ...shellMotion,
        "&::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          zIndex: -2,
          backgroundImage:
            "linear-gradient(rgba(97,244,222,0.065) 1px, transparent 1px), linear-gradient(90deg, rgba(97,244,222,0.065) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.18))",
          animation: "gridDrift 22s linear infinite",
        },
        "&::after": {
          content: '""',
          position: "fixed",
          inset: "-18% -10% auto -10%",
          height: "64vh",
          zIndex: -1,
          background:
            "radial-gradient(ellipse at 32% 38%, rgba(77,255,165,0.16), transparent 48%), radial-gradient(ellipse at 68% 24%, rgba(97,244,222,0.18), transparent 46%)",
          filter: "blur(34px)",
          animation: "aurora 12s ease-in-out infinite",
        },
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: 1360, px: { xs: 1.75, sm: 2.5, md: 3 }, py: { xs: 2, md: 3.5 } }}>
        <Stack spacing={{ xs: 2, md: 2.5 }}>
          <HeaderPanel
            currentSnapshot={currentQuery.data}
            isFetching={currentQuery.isFetching}
            locating={locating}
            location={location}
            refetchCurrent={() => currentQuery.refetch()}
            requestLocation={requestLocation}
            searchData={searchQuery.data ?? []}
            searchFetching={searchQuery.isFetching}
            searchText={searchText}
            setActiveTab={setActiveTab}
            setLocation={setLocation}
            setLocationNotice={setLocationNotice}
            setSearchText={setSearchText}
            sourceChips={sourceChips}
          />

          {locationNotice ? (
            <Alert
              severity="warning"
              onClose={() => setLocationNotice(null)}
              sx={{
                border: "1px solid rgba(255, 209, 102, 0.32)",
                background: "rgba(255, 209, 102, 0.1)",
                color: "#fff4cf",
                borderRadius: 2,
              }}
            >
              {locationNotice}
            </Alert>
          ) : null}

          {location ? (
            <WeatherPanels
              activeTab={activeTab}
              currentQuery={currentQuery}
              locating={locating}
              location={location}
              setActiveTab={setActiveTab}
            />
          ) : (
            <EmptyLocationPanel
              locating={locating}
              notice={locationNotice}
              onLocate={requestLocation}
              onSelectSpot={(spot) => {
                setLocation(spot);
                setLocationNotice(null);
                setActiveTab(0);
              }}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
}

function HeaderPanel({
  currentSnapshot,
  isFetching,
  locating,
  location,
  refetchCurrent,
  requestLocation,
  searchData,
  searchFetching,
  searchText,
  setActiveTab,
  setLocation,
  setLocationNotice,
  setSearchText,
  sourceChips,
}: {
  currentSnapshot?: CurrentSnapshot;
  isFetching: boolean;
  locating: boolean;
  location: LocationChoice | null;
  refetchCurrent: () => void;
  requestLocation: () => void;
  searchData: LocationChoice[];
  searchFetching: boolean;
  searchText: string;
  setActiveTab: (value: number) => void;
  setLocation: (value: LocationChoice | null) => void;
  setLocationNotice: (value: string | null) => void;
  setSearchText: (value: string) => void;
  sourceChips: string[];
}) {
  return (
    <PanelShell sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      <Stack spacing={{ xs: 2, md: 2.5 }}>
        {/* Top Brand Bar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <LogoBeacon />
            <Box>
              <Typography
                component="h1"
                variant="h1"
                sx={{
                  fontSize: { xs: "1.85rem", sm: "2.3rem", md: "2.6rem" },
                  textShadow: "0 0 34px rgba(97,244,222,0.22)",
                  lineHeight: 1,
                }}
              >
                Parapantabil.ro
              </Typography>
              <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 700, mt: 0.3 }}>
                Consolă Meteo & Decizie Zbor Parapantă
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip icon={<LogoMark size={16} />} size="small" label="Sistem Activ" sx={{ borderColor: "rgba(97,244,222,0.3)" }} />
            {sourceChips.map((source) => (
              <Chip key={source} size="small" label={romanianSource(source)} />
            ))}
          </Stack>
        </Stack>

        {/* ABOVE THE FOLD FEATURE EXPLANATION SECTION */}
        <Box
          sx={{
            pt: 0.5,
            borderTop: "1px solid rgba(141, 245, 255, 0.12)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#c5d8e8",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: 1.25,
            }}
          >
            Cum funcționează platforma de decizie:
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 1.25,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
            }}
          >
            <FeatureExplanationCard
              icon={<CheckCircleIcon sx={{ color: "#4dffa5" }} />}
              title="1. Verdict & Scor (0–100)"
              description="Sintetizează viteza vântului, rafalele, instabilitatea și vizibilitatea într-o decizie clară: Parapantabil, La limită sau Nu lansa."
            />
            <FeatureExplanationCard
              icon={<AccessTimeIcon sx={{ color: "#61f4de" }} />}
              title="2. Ferestre Optime de Zbor"
              description="Scanează oră cu oră evoluția zilei și recomandă cele mai sigure intervale de lansare în condiții de lumină naturală."
            />
            <FeatureExplanationCard
              icon={<CompassCalibrationIcon sx={{ color: "#ffd166" }} />}
              title="3. Telemetrie Vânt & Turbulență"
              description="Calculează vântul la 10m, ecartul rafalelor (risc de turbulență), indicele CAPE (convecție) și calitatea aerului."
            />
            <FeatureExplanationCard
              icon={<MapIcon sx={{ color: "#61f4de" }} />}
              title="4. Căutare & GPS Liber"
              description="Afișează condițiile pentru poziția ta GPS curentă sau pentru orice zonă de decolare și localitate din România și din lume."
            />
          </Box>
        </Box>

        {/* Popular Locations Shortcuts */}
        <Box sx={{ pt: 0.5 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: { xs: "flex-start", sm: "center" }, mb: 1 }}>
            <Typography variant="body2" sx={{ color: "#bfefff", fontWeight: 700, whiteSpace: "nowrap" }}>
              📍 Zone populare de decolare:
            </Typography>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
              {POPULAR_SPOTS.map((spot) => (
                <Chip
                  key={spot.id}
                  label={spot.name}
                  onClick={() => {
                    setLocation(spot);
                    setLocationNotice(null);
                    setActiveTab(0);
                  }}
                  clickable
                  size="small"
                  sx={{
                    background: location?.id === spot.id ? "rgba(97,244,222,0.25)" : "rgba(255,255,255,0.06)",
                    borderColor: location?.id === spot.id ? "#61f4de" : "rgba(141,245,255,0.18)",
                    color: location?.id === spot.id ? "#ffffff" : "#dffcff",
                    fontWeight: 700,
                    "&:hover": {
                      background: "rgba(97,244,222,0.2)",
                      borderColor: "#61f4de",
                    },
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* Controls Bar: Search & Location Buttons */}
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr", lg: "1fr auto" },
            alignItems: "center",
            p: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(97,244,222,0.22)",
            borderRadius: 2,
            background: "rgba(1, 8, 18, 0.65)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.8 }}>
              <KeyboardCommandKeyIcon sx={{ color: "primary.main", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "#bfefff", fontWeight: 800 }}>
                Căutare zonă de zbor
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", ml: "auto" }}>
                minim 3 caractere
              </Typography>
            </Stack>
            <Autocomplete
              fullWidth
              clearText="Golește"
              closeText="Închide"
              filterOptions={(options) => options}
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : [option.name, option.detail].filter(Boolean).join(", ")
              }
              inputValue={searchText}
              loading={searchFetching}
              loadingText="Se caută pe hartă..."
              noOptionsText="Nicio zonă găsită"
              onChange={(_, nextValue) => {
                if (nextValue && typeof nextValue !== "string") {
                  setLocation(nextValue);
                  setLocationNotice(null);
                  setActiveTab(0);
                  setSearchText("");
                }
              }}
              onInputChange={(_, nextValue) => setSearchText(nextValue)}
              openText="Deschide"
              options={searchData}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Caută zonă / localitate"
                  placeholder="ex: Bunloc, Clopotiva, Brașov, Poiana Brașov..."
                />
              )}
            />
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ width: { xs: "100%", lg: "auto" }, justifyContent: "flex-end" }}
          >
            <LocationSummary location={location} snapshot={currentSnapshot} />
            <Tooltip title="Folosește poziția GPS a dispozitivului">
              <span>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={
                    locating ? <CircularProgress size={18} color="inherit" /> : <MyLocationIcon />
                  }
                  onClick={requestLocation}
                  disabled={locating}
                  sx={{
                    color: "#021115",
                    background: "linear-gradient(135deg, #61f4de 0%, #4dffa5 100%)",
                    boxShadow: "0 14px 32px rgba(77,255,165,0.22)",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 18px 42px rgba(77,255,165,0.28)",
                    },
                  }}
                >
                  Poziția mea GPS
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Recalibrează datele meteo live">
              <span>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={refetchCurrent}
                  disabled={!location || isFetching}
                  sx={{
                    borderColor: "rgba(97,244,222,0.42)",
                    color: "#dffcff",
                    background: "rgba(97,244,222,0.05)",
                  }}
                >
                  Recalibrează
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
    </PanelShell>
  );
}

function FeatureExplanationCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <Box
      sx={{
        p: 1.35,
        border: "1px solid rgba(141, 245, 255, 0.14)",
        borderRadius: 2,
        background: "rgba(255, 255, 255, 0.035)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.6 }}>
        <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
        <Typography sx={{ fontWeight: 800, color: "#f5fbff", fontSize: "0.95rem" }}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: "#9fb2c5", fontSize: "0.85rem", lineHeight: 1.45 }}>
        {description}
      </Typography>
    </Box>
  );
}

function LocationSummary({
  location,
}: {
  location: LocationChoice | null;
  snapshot?: CurrentSnapshot;
}) {
  if (!location) {
    return (
      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2,
          border: "1px dashed rgba(141, 245, 255, 0.22)",
          background: "rgba(255, 255, 255, 0.03)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PlaceIcon sx={{ color: "text.secondary", fontSize: 20 }} />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Nicio zonă selectată
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.8,
        borderRadius: 2,
        border: "1px solid rgba(97,244,222,0.3)",
        background: "rgba(97,244,222,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 1,
        minWidth: 0,
      }}
    >
      <PlaceIcon sx={{ color: "primary.main", fontSize: 20 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 800, fontSize: "0.92rem" }}>
          {location.name}
        </Typography>
        <Typography variant="body2" noWrap sx={{ color: "text.secondary", fontSize: "0.78rem" }}>
          {location.detail || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
        </Typography>
      </Box>
    </Box>
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
  return (
    <Stack spacing={{ xs: 2, md: 2.25 }}>
      <PanelShell sx={{ p: 0.75 }}>
        <Tabs
          value={activeTab}
          onChange={(_, nextValue) => setActiveTab(nextValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            position: "relative",
            zIndex: 1,
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTabs-flexContainer": { gap: 0.75 },
            "& .MuiTab-root.Mui-selected": {
              color: "#041116 !important",
              background: "linear-gradient(135deg, #61f4de, #4dffa5)",
              boxShadow: "0 12px 28px rgba(77,255,165,0.2)",
            },
          }}
        >
          <Tab label="Condiții Live (Acum)" value={0} />
          {[1, 2, 3].map((offset) => (
            <Tab key={offset} label={formatDateLabel(dateForOffset(offset))} value={offset} />
          ))}
        </Tabs>
      </PanelShell>

      {activeTab === 0 ? (
        <CurrentPanel
          queryError={currentQuery.error}
          snapshot={currentQuery.data}
          isLoading={currentQuery.isLoading || locating}
          isFetching={currentQuery.isFetching}
        />
      ) : null}

      {[1, 2, 3].map((offset) => (
        <ForecastPanel key={offset} active={activeTab === offset} location={location} offset={offset} />
      ))}
    </Stack>
  );
}

function CurrentPanel({
  isFetching,
  isLoading,
  queryError,
  snapshot,
}: {
  isFetching: boolean;
  isLoading: boolean;
  queryError: Error | null;
  snapshot?: CurrentSnapshot;
}) {
  if (queryError) {
    return (
      <Alert severity="error" sx={darkAlertSx("error")}>
        Datele meteo live nu au putut fi încărcate: {queryError.message}
      </Alert>
    );
  }

  if (isLoading || !snapshot) {
    return <DashboardSkeleton />;
  }

  return (
    <Stack spacing={{ xs: 2, md: 2.25 }}>
      {isFetching ? (
        <LinearProgress
          color="primary"
          sx={{
            borderRadius: 1,
            background: "rgba(97,244,222,0.08)",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #61f4de, #4dffa5)",
            },
          }}
        />
      ) : null}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.06fr) minmax(360px, 0.94fr)" },
          alignItems: "stretch",
        }}
      >
        <DecisionDeck
          eyebrow="scanare live"
          sample={snapshot.sample}
          timezone={snapshot.timezone}
          title="Verdict Curent de Zbor"
          verdict={snapshot.verdict}
        />
        <AtmospherePanel snapshot={snapshot} />
      </Box>
      <MetricGrid sample={snapshot.sample} />
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
  const date = useMemo(() => dateForOffset(offset), [offset]);
  const forecastQuery = useQuery({
    queryKey: ["day-forecast", location.latitude, location.longitude, date],
    queryFn: () => fetchDayForecast(location, date),
    enabled: active,
  });

  if (!active) return null;
  if (forecastQuery.error) {
    return (
      <Alert severity="error" sx={darkAlertSx("error")}>
        Prognoza nu a putut fi încărcată: {forecastQuery.error.message}
      </Alert>
    );
  }
  if (forecastQuery.isLoading || !forecastQuery.data) return <DashboardSkeleton />;

  return <DayForecastView forecast={forecastQuery.data} />;
}

function DayForecastView({ forecast }: { forecast: DayForecast }) {
  const bestSample = forecast.best.sample;

  return (
    <Stack spacing={{ xs: 2, md: 2.25 }}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.06fr) minmax(360px, 0.94fr)" },
        }}
      >
        <DecisionDeck
          eyebrow={formatDateLabel(forecast.date)}
          sample={bestSample}
          timezone={forecast.timezone}
          title="Cea mai bună fereastră"
          verdict={forecast.best.verdict}
        />
        <DailyPulsePanel forecast={forecast} />
      </Box>

      {bestSample ? <MetricGrid sample={bestSample} /> : null}
      <LaunchWindowScanner forecast={forecast} />
    </Stack>
  );
}

function EmptyLocationPanel({
  locating,
  notice,
  onLocate,
  onSelectSpot,
}: {
  locating: boolean;
  notice: string | null;
  onLocate: () => void;
  onSelectSpot: (spot: LocationChoice) => void;
}) {
  return (
    <PanelShell sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: { xs: "auto", md: 540 } }}>
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2.5, md: 3 },
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={2.2} sx={{ order: { xs: 2, md: 1 } }}>
          <Chip
            icon={<LogoMark size={18} />}
            label="sistem pregătit pentru analiză"
            sx={{ alignSelf: "flex-start", color: "#bffcff" }}
          />
          <Box>
            <Typography variant="h2" component="h2" sx={{ fontSize: { xs: "1.6rem", sm: "2rem" }, overflowWrap: "anywhere" }}>
              Calibrează zona de decolare
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary", fontSize: "0.98rem" }}>
              Alege una dintre zonele populare de mai jos, caută o localitate sau activează poziția ta GPS.
              Consola va genera instantaneu verdictul meteo pentru parapantă, semnalând riscurile critice.
            </Typography>
          </Box>

          {notice ? (
            <Alert severity="info" sx={darkAlertSx("info")}>
              {notice}
            </Alert>
          ) : null}

          <Box>
            <Typography variant="body2" sx={{ color: "#bfefff", fontWeight: 800, mb: 1 }}>
              Lansare rapidă — Zone frecventate din România:
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
              }}
            >
              {POPULAR_SPOTS.map((spot) => (
                <Button
                  key={spot.id}
                  variant="outlined"
                  onClick={() => onSelectSpot(spot)}
                  sx={{
                    justifyContent: "flex-start",
                    textAlign: "left",
                    p: 1.25,
                    borderColor: "rgba(141,245,255,0.22)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#f5fbff",
                    "&:hover": {
                      borderColor: "#61f4de",
                      background: "rgba(97,244,222,0.12)",
                    },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.88rem" }}>
                      {spot.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.74rem" }}>
                      {spot.detail}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            sx={{ alignItems: { xs: "stretch", sm: "center" }, pt: 0.5 }}
          >
            <Button
              variant="contained"
              startIcon={
                locating ? <CircularProgress size={18} color="inherit" /> : <LocationSearchingIcon />
              }
              onClick={onLocate}
              disabled={locating}
              sx={{
                color: "#041116",
                background: "linear-gradient(135deg, #61f4de, #4dffa5)",
                py: 1.2,
              }}
            >
              Detectează poziția GPS
            </Button>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
              Coordonatele sunt folosite exclusiv pentru generarea prognozei meteo.
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ minHeight: { xs: 260, sm: 340, md: 440 }, order: { xs: 1, md: 2 }, position: "relative" }}>
          <HolographicLaunchMap />
        </Box>
      </Box>
    </PanelShell>
  );
}

function DecisionDeck({
  eyebrow,
  sample,
  timezone,
  title,
  verdict,
}: {
  eyebrow: string;
  sample: WeatherSample | null;
  timezone: string;
  title: string;
  verdict: FlightVerdict;
}) {
  const tone = toneByStatus[verdict.status];
  const primaryReasons = verdict.reasons.length > 0 ? verdict.reasons : ["Condiții atmosferice favorabile."];

  return (
    <PanelShell sx={{ p: { xs: 1.8, sm: 2.2, md: 2.5 }, minHeight: 356 }}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "176px 1fr" },
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ScoreOrb score={verdict.score} status={verdict.status} />
        <Stack spacing={1.45}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
            <Chip
              icon={<SensorsIcon />}
              label={eyebrow}
              size="small"
              sx={{ color: "#dffcff", borderColor: "rgba(97,244,222,0.22)" }}
            />
            <Chip
              label={tone.label}
              size="small"
              sx={{ color: tone.color, background: tone.dim, borderColor: tone.color }}
            />
          </Stack>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 800 }}>
              {title}
            </Typography>
            <Typography
              component="h2"
              variant="h2"
              sx={{
                mt: 0.4,
                color: tone.color,
                fontSize: { xs: "1.7rem", sm: "2rem" },
                textShadow: `0 0 28px ${tone.glow}`,
              }}
            >
              {verdict.title}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <SignalMini
              compact
              icon={<TimelineIcon />}
              label="Eșantion"
              value={sample ? formatTime(sample.time, timezone) : "n/d"}
            />
            <SignalMini
              compact
              icon={<AirIcon />}
              label="Vânt"
              value={sample ? numberLabel(sample.windSpeed, "km/h") : "n/d"}
            />
            <SignalMini
              compact
              icon={<SpeedIcon />}
              label="Rafală"
              value={sample ? numberLabel(sample.windGusts, "km/h") : "n/d"}
            />
          </Stack>
          <Stack spacing={0.8}>
            {primaryReasons.slice(0, 4).map((reason) => (
              <RiskLine key={reason} color={tone.color}>
                {reason}
              </RiskLine>
            ))}
            {verdict.cautions.slice(0, 2).map((reason) => (
              <RiskLine key={reason} color="#ffd166">
                {reason}
              </RiskLine>
            ))}
          </Stack>
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              pt: 1,
              color: "text.secondary",
            }}
          >
            <Typography variant="body2" sx={{ fontSize: "0.82rem" }}>
              Suport de decizie, nu autorizare de zbor. Verifică vântul real la decolare,
              rotorul, dezvoltarea convectivă, regulile zonei și limitele tale de pilot.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </PanelShell>
  );
}

function AtmospherePanel({ snapshot }: { snapshot: CurrentSnapshot }) {
  const { sample } = snapshot;
  const gustSpread =
    sample.windSpeed !== null && sample.windGusts !== null
      ? sample.windGusts - sample.windSpeed
      : null;

  return (
    <PanelShell sx={{ p: { xs: 1.8, sm: 2.2 }, minHeight: 356 }}>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 1.5 }}>
          <Chip icon={<SatelliteAltIcon />} size="small" label="telemetrie atmosferă" />
          <Chip icon={<TerrainIcon />} size="small" label={`grid ${numberLabel(snapshot.elevation, "m")}`} />
        </Stack>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "190px 1fr" },
            alignItems: "center",
          }}
        >
          <WindDial sample={sample} />
          <Stack spacing={1.35}>
            <Box>
              <Typography component="h2" variant="h2">
                {sample.weatherLabel}
              </Typography>
              <Typography sx={{ color: "text.secondary", mt: 0.4, fontSize: "0.88rem" }}>
                Actualizat la {formatTime(sample.time, snapshot.timezone)}, ora locală
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(2, minmax(0, 1fr))" },
              }}
            >
              <SignalMini icon={<DeviceThermostatIcon />} label="Temperatură" value={numberLabel(sample.temperature, "C", 1)} />
              <SignalMini icon={<NavigationIcon />} label="Direcție" value={windDirectionLabel(sample.windDirection)} />
              <SignalMini icon={<SpeedIcon />} label="Ecart rafale" value={numberLabel(gustSpread, "km/h")} />
              <SignalMini icon={<ThunderstormIcon />} label="CAPE" value={numberLabel(sample.cape, "J/kg")} />
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
              Modelul calculează vântul la 10 m. Dacă valea, creasta sau briza termică diferă,
              prioritatea rămâne verificarea condițiilor în teren.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </PanelShell>
  );
}

function DailyPulsePanel({ forecast }: { forecast: DayForecast }) {
  return (
    <PanelShell sx={{ p: { xs: 1.8, sm: 2.2 }, minHeight: 356 }}>
      <Stack spacing={1.8} sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Chip icon={<DataUsageIcon />} size="small" label="sumar zi" />
          <Chip icon={<WbSunnyIcon />} size="small" label={`${formatTime(forecast.daily.sunrise, forecast.timezone)} - ${formatTime(forecast.daily.sunset, forecast.timezone)}`} />
        </Stack>
        <Box>
          <Typography variant="h2">{forecast.daily.weatherLabel}</Typography>
          <Typography sx={{ mt: 0.6, color: "text.secondary", fontSize: "0.92rem" }}>
            Profilul zilei pentru deplasare, briefing și alegerea ferestrei optime de lansare.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          }}
        >
          <MiniMetric label="Temperatură" value={`${numberLabel(forecast.daily.temperatureMin, "C")} / ${numberLabel(forecast.daily.temperatureMax, "C")}`} />
          <MiniMetric label="Vânt max." value={numberLabel(forecast.daily.windSpeedMax, "km/h")} />
          <MiniMetric label="Rafală max." value={numberLabel(forecast.daily.windGustsMax, "km/h")} />
          <MiniMetric label="Risc ploaie" value={percentLabel(forecast.daily.precipitationProbabilityMax)} />
          <MiniMetric label="Ploaie total" value={numberLabel(forecast.daily.precipitationSum, "mm", 1)} />
          <MiniMetric label="UV max." value={numberLabel(forecast.daily.uvIndexMax, "", 1)} />
          <MiniMetric label="Răsărit" value={formatTime(forecast.daily.sunrise, forecast.timezone)} />
          <MiniMetric label="Apus" value={formatTime(forecast.daily.sunset, forecast.timezone)} />
        </Box>
      </Stack>
    </PanelShell>
  );
}

function MetricGrid({ sample }: { sample: WeatherSample }) {
  const gustSpread =
    sample.windSpeed !== null && sample.windGusts !== null
      ? sample.windGusts - sample.windSpeed
      : null;
  const metrics = [
    {
      label: "Vânt",
      value: numberLabel(sample.windSpeed, "km/h"),
      detail: `${windDirectionLabel(sample.windDirection)} la 10 m`,
      icon: <AirIcon />,
      status: sample.windSpeed !== null && sample.windSpeed >= 8 && sample.windSpeed <= 22 ? "good" : "marginal",
    },
    {
      label: "Rafale",
      value: numberLabel(sample.windGusts, "km/h"),
      detail: `ecart ${numberLabel(gustSpread, "km/h")}`,
      icon: <SpeedIcon />,
      status: gustSpread !== null && gustSpread > 16 ? "no-go" : gustSpread !== null && gustSpread > 10 ? "marginal" : "good",
    },
    {
      label: "Precipitații",
      value: numberLabel(sample.precipitation, "mm", 1),
      detail: `probabilitate ${percentLabel(sample.precipitationProbability)}`,
      icon: <WaterDropIcon />,
      status: sample.precipitation !== null && sample.precipitation >= 0.2 ? "no-go" : "good",
    },
    {
      label: "Vizibilitate",
      value: distanceLabel(sample.visibility),
      detail: sample.weatherLabel,
      icon: <VisibilityIcon />,
      status: sample.visibility !== null && sample.visibility < 5000 ? "no-go" : sample.visibility !== null && sample.visibility < 10000 ? "marginal" : "good",
    },
    {
      label: "Nori",
      value: percentLabel(sample.cloudCover),
      detail: `CAPE ${numberLabel(sample.cape, "J/kg")}`,
      icon: <CloudIcon />,
      status: sample.cloudCover !== null && sample.cloudCover > 90 ? "marginal" : "good",
    },
    {
      label: "Termic",
      value: numberLabel(sample.temperature, "C", 1),
      detail: `resimțit ${numberLabel(sample.apparentTemperature, "C", 1)}`,
      icon: <DeviceThermostatIcon />,
      status: "good",
    },
    {
      label: "Presiune",
      value: numberLabel(sample.pressure, "hPa"),
      detail: `umiditate ${percentLabel(sample.humidity)}`,
      icon: <ThunderstormIcon />,
      status: "good",
    },
    {
      label: "Aer + soare",
      value: sample.usAqi === null ? `UV ${numberLabel(sample.uvIndex, "", 1)}` : `AQI ${Math.round(sample.usAqi)}`,
      detail: `PM2.5 ${numberLabel(sample.pm25, "ug/m3", 1)}`,
      icon: <WbSunnyIcon />,
      status: sample.usAqi !== null && sample.usAqi > 150 ? "marginal" : "good",
    },
  ] satisfies Array<{
    label: string;
    value: string;
    detail: string;
    icon: ReactNode;
    status: FlightStatus;
  }>;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.25,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
      }}
    >
      {metrics.map((metric) => (
        <MetricTile key={metric.label} {...metric} />
      ))}
    </Box>
  );
}

function MetricTile({
  detail,
  icon,
  label,
  status,
  value,
}: {
  detail: string;
  icon: ReactNode;
  label: string;
  status: FlightStatus;
  value: string;
}) {
  const tone = toneByStatus[status];

  return (
    <Box
      sx={{
        minHeight: 124,
        p: 1.5,
        border: `1px solid ${tone.dim}`,
        borderRadius: 2,
        background:
          "linear-gradient(145deg, rgba(12,24,43,0.74), rgba(4,10,22,0.66))",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 34px rgba(0,0,0,0.18)`,
        transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: tone.color,
          boxShadow: `0 18px 46px ${tone.glow}`,
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              color: tone.color,
              background: tone.dim,
            }}
          >
            {icon}
          </Box>
          <Typography sx={{ fontWeight: 820 }}>{label}</Typography>
        </Stack>
        <Typography variant="h3" sx={{ fontSize: "1.35rem" }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
          {detail}
        </Typography>
      </Stack>
    </Box>
  );
}

function LaunchWindowScanner({ forecast }: { forecast: DayForecast }) {
  return (
    <PanelShell sx={{ p: { xs: 1.8, sm: 2.2 } }}>
      <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
          <Chip icon={<TimelineIcon />} label="ferestre de lansare" />
          <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
            orele de lumină ordonate după scorul de siguranță și risc
          </Typography>
        </Stack>

        {forecast.topWindows.length === 0 ? (
          <Alert severity="warning" sx={darkAlertSx("warning")}>
            Nicio oră cu lumină nu trece de filtrele conservatoare pentru vânt, vreme și vizibilitate.
          </Alert>
        ) : (
          <Stack spacing={1}>
            {forecast.topWindows.map(({ sample, verdict }) => {
              const tone = toneByStatus[verdict.status];
              return (
                <Box
                  key={sample.time}
                  sx={{
                    display: "grid",
                    gap: 1.25,
                    gridTemplateColumns: { xs: "1fr", sm: "80px 140px 1fr 180px" },
                    alignItems: "center",
                    p: 1.25,
                    border: `1px solid ${tone.dim}`,
                    borderRadius: 2,
                    background: "rgba(2, 10, 21, 0.54)",
                    transition: "transform 180ms ease, border-color 180ms ease",
                    "&:hover": {
                      transform: "translateX(4px)",
                      borderColor: tone.color,
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: 900, color: "#effcff" }}>
                    {formatTime(sample.time, forecast.timezone)}
                  </Typography>
                  <Box>
                    <Typography variant="body2" sx={{ color: tone.color, fontWeight: 900 }}>
                      {verdict.title}
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.6,
                        height: 8,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.08)",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${verdict.score}%`,
                          height: "100%",
                          background: `linear-gradient(90deg, ${tone.color}, #61f4de)`,
                          boxShadow: `0 0 18px ${tone.glow}`,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>
                    Vânt {numberLabel(sample.windSpeed, "km/h")} / rafală {numberLabel(sample.windGusts, "km/h")}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>
                    {sample.weatherLabel}, ploaie {percentLabel(sample.precipitationProbability)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        )}
      </Stack>
    </PanelShell>
  );
}

function ScoreOrb({ score, status }: { score: number; status: FlightStatus }) {
  const tone = toneByStatus[status];
  const angle = Math.max(0, Math.min(360, Math.round(score * 3.6)));

  return (
    <Box
      aria-label={`Scor parapantabil ${score} din 100`}
      role="img"
      sx={{
        width: { xs: 150, sm: 176 },
        height: { xs: 150, sm: 176 },
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        mx: { xs: "auto", sm: 0 },
        position: "relative",
        background: `conic-gradient(${tone.color} 0deg ${angle}deg, rgba(255,255,255,0.08) ${angle}deg 360deg)`,
        boxShadow: `0 0 48px ${tone.glow}`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 10,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.12), transparent 28%), #06101f",
          boxShadow: "inset 0 0 28px rgba(0,0,0,0.6)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: -7,
          borderRadius: "50%",
          border: `1px solid ${tone.color}`,
          borderTopColor: "transparent",
          opacity: 0.52,
          animation: "orbit 8s linear infinite",
        },
      }}
    >
      <Stack spacing={0.2} sx={{ position: "relative", alignItems: "center", zIndex: 1 }}>
        <Typography sx={{ color: tone.color, fontWeight: 900, fontSize: { xs: "3.2rem", sm: "3.9rem" }, lineHeight: 0.95 }}>
          {score}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 900 }}>
          /100
        </Typography>
      </Stack>
    </Box>
  );
}

function WindDial({ sample }: { sample: WeatherSample }) {
  const rotation = sample.windDirection ?? 0;
  const status: FlightStatus =
    sample.windSpeed !== null && sample.windSpeed >= 8 && sample.windSpeed <= 22
      ? "good"
      : sample.windSpeed !== null && sample.windSpeed > 28
        ? "no-go"
        : "marginal";
  const tone = toneByStatus[status];

  return (
    <Box
      aria-label={`Vânt ${windDirectionLabel(sample.windDirection)} ${numberLabel(sample.windSpeed, "km/h")}`}
      role="img"
      sx={{
        width: { xs: 160, sm: 190 },
        height: { xs: 160, sm: 190 },
        borderRadius: "50%",
        border: "1px solid rgba(141,245,255,0.22)",
        background:
          "radial-gradient(circle at 50% 50%, rgba(97,244,222,0.14), rgba(2,8,18,0.86) 58%), conic-gradient(from 0deg, rgba(97,244,222,0.22), rgba(255,209,102,0.14), rgba(255,92,122,0.12), rgba(97,244,222,0.22))",
        boxShadow: `0 0 42px ${tone.glow}, inset 0 0 34px rgba(0,0,0,0.46)`,
        display: "grid",
        placeItems: "center",
        position: "relative",
        mx: { xs: "auto", sm: 0 },
      }}
    >
      {["N", "E", "S", "V"].map((point) => (
        <Typography
          key={point}
          variant="body2"
          sx={{
            color: "#dffcff",
            fontWeight: 900,
            position: "absolute",
            top: point === "N" ? 10 : point === "S" ? "auto" : "50%",
            bottom: point === "S" ? 10 : "auto",
            left: point === "V" ? 12 : point === "E" ? "auto" : "50%",
            right: point === "E" ? 12 : "auto",
            transform:
              point === "N" || point === "S"
                ? "translateX(-50%)"
                : "translateY(-50%)",
          }}
        >
          {point}
        </Typography>
      ))}
      <Box
        sx={{
          width: 8,
          height: 60,
          borderRadius: 999,
          background: tone.color,
          transform: `rotate(${rotation}deg) translateY(-20px)`,
          transformOrigin: "center 50px",
          boxShadow: `0 0 24px ${tone.glow}`,
          transition: "transform 500ms ease",
          "&::before": {
            content: '""',
            display: "block",
            width: 0,
            height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderBottom: `20px solid ${tone.color}`,
            transform: "translate(-7px, -14px)",
          },
        }}
      />
      <Stack spacing={0.2} sx={{ position: "absolute", alignItems: "center" }}>
        <Typography variant="h3" sx={{ color: tone.color, fontSize: "1.45rem" }}>
          {windDirectionLabel(sample.windDirection)}
        </Typography>
        <Typography variant="body2" sx={{ color: "#c5d8e8", fontSize: "0.85rem" }}>
          {numberLabel(sample.windSpeed, "km/h")}
        </Typography>
      </Stack>
    </Box>
  );
}

function SignalMini({
  compact = false,
  icon,
  label,
  value,
}: {
  compact?: boolean;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        minWidth: compact ? 110 : "auto",
        minHeight: compact ? 54 : 72,
        p: compact ? 0.85 : 1.1,
        border: "1px solid rgba(141,245,255,0.14)",
        borderRadius: 2,
        background: "rgba(255,255,255,0.045)",
      }}
    >
      <Stack direction="row" spacing={0.85} sx={{ alignItems: "center" }}>
        <Box sx={{ color: "primary.main", display: "grid", placeItems: "center" }}>{icon}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>
            {label}
          </Typography>
          <Typography sx={{ fontWeight: 880, overflowWrap: "anywhere", fontSize: compact ? "0.88rem" : "0.95rem" }}>{value}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        minHeight: 74,
        p: 1.15,
        border: "1px solid rgba(141,245,255,0.14)",
        borderRadius: 2,
        background: "rgba(255,255,255,0.045)",
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.35, fontWeight: 880, fontSize: "0.95rem" }}>{value}</Typography>
    </Box>
  );
}

function RiskLine({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <Stack direction="row" spacing={0.9} sx={{ alignItems: "flex-start" }}>
      <WarningAmberIcon sx={{ color, fontSize: 18, mt: "2px" }} />
      <Typography variant="body2" sx={{ fontSize: "0.88rem" }}>{children}</Typography>
    </Stack>
  );
}

function PanelShell({ children, sx = {} }: { children: ReactNode; sx?: object }) {
  return <Box sx={{ ...glassPanel, ...sx }}>{children}</Box>;
}

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <Box
      component="img"
      src={LOGO_SRC}
      alt=""
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        objectFit: "contain",
        filter: "drop-shadow(0 0 8px rgba(97,244,222,0.46))",
      }}
    />
  );
}

function LogoBeacon() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: { xs: 54, sm: 64, md: 72 },
        height: { xs: 54, sm: 64, md: 72 },
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        position: "relative",
        background:
          "radial-gradient(circle at 50% 50%, rgba(97,244,222,0.16), rgba(2,8,18,0.82) 68%)",
        boxShadow: "0 0 34px rgba(97,244,222,0.24), inset 0 0 22px rgba(0,0,0,0.55)",
        flexShrink: 0,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: "1px solid rgba(97,244,222,0.28)",
          borderTopColor: "rgba(255,209,102,0.72)",
          animation: "orbit 11s linear infinite",
        },
      }}
    >
      <Box
        component="img"
        src={LOGO_SRC}
        alt=""
        sx={{
          width: { xs: 42, sm: 50, md: 58 },
          height: { xs: 42, sm: 50, md: 58 },
          objectFit: "contain",
          filter: "drop-shadow(0 0 12px rgba(77,255,165,0.36))",
        }}
      />
    </Box>
  );
}

function DashboardSkeleton() {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.06fr) minmax(360px, 0.94fr)" },
        }}
      >
        <PanelShell sx={{ p: 2, minHeight: 356 }}>
          <Stack spacing={2} sx={{ alignItems: "center", justifyContent: "center", minHeight: 286 }}>
            <LogoBeacon />
            <Skeleton variant="rounded" height={92} width="100%" sx={skeletonSx} />
          </Stack>
        </PanelShell>
        <PanelShell sx={{ p: 2, minHeight: 356 }}>
          <Skeleton variant="rounded" height={286} sx={skeletonSx} />
        </PanelShell>
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={128} sx={skeletonSx} />
        ))}
      </Box>
    </Stack>
  );
}

function HolographicLaunchMap() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 680 520"
        role="img"
        sx={{
          width: "min(100%, 680px)",
          height: "auto",
          maxHeight: 520,
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.34))",
        }}
      >
        <defs>
          <linearGradient id="holoWing" x1="0" x2="1">
            <stop offset="0%" stopColor="#61f4de" />
            <stop offset="52%" stopColor="#4dffa5" />
            <stop offset="100%" stopColor="#ffd166" />
          </linearGradient>
          <radialGradient id="holoGlow" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#61f4de" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#0b2634" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#020812" stopOpacity="0.92" />
          </radialGradient>
        </defs>
        <rect x="18" y="22" width="644" height="476" rx="34" fill="url(#holoGlow)" stroke="#61f4de" strokeOpacity="0.22" />
        <path d="M24 394 L130 282 L198 348 L270 236 L346 354 L420 268 L504 374 L656 298 L656 498 L24 498 Z" fill="#61f4de" opacity="0.08" />
        <path d="M34 418 L138 326 L230 382 L330 284 L450 408 L560 344 L656 390" fill="none" stroke="#61f4de" strokeOpacity="0.32" strokeWidth="2" />
        <path d="M82 438 C188 398 260 410 360 374 C460 338 534 364 618 318" fill="none" stroke="#4dffa5" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="8 12" />
        <circle cx="530" cy="116" r="44" fill="#ffd166" opacity="0.72" />

        {[210, 282, 354, 426].map((x, index) => (
          <path
            key={x}
            d={`M${x} 430 C${x - 34} 358 ${x + 30} 322 ${x} 248`}
            fill="none"
            stroke={index % 2 ? "#4dffa5" : "#61f4de"}
            strokeLinecap="round"
            strokeWidth="3"
            strokeDasharray="10 14"
            style={{ animation: `pathPulse ${5 + index * 0.6}s ease-out ${index * 0.45}s infinite` }}
          />
        ))}

        <image
          href={LOGO_SRC}
          x="188"
          y="82"
          width="304"
          height="304"
          preserveAspectRatio="xMidYMid meet"
          style={{
            animation: "floatWing 6.6s ease-in-out infinite",
            filter:
              "drop-shadow(0 0 32px rgba(97,244,222,0.44)) drop-shadow(0 20px 36px rgba(0,0,0,0.36))",
          }}
        />

        <g opacity="0.55">
          <circle cx="348" cy="288" r="140" fill="none" stroke="#61f4de" strokeOpacity="0.22" />
          <circle cx="348" cy="288" r="204" fill="none" stroke="#61f4de" strokeOpacity="0.12" />
          <path d="M348 84 L348 492 M144 288 L552 288" stroke="#61f4de" strokeOpacity="0.14" />
        </g>
      </Box>
    </Box>
  );
}

function romanianSource(source: string) {
  if (source.includes("Air Quality")) return "calitatea aerului Open-Meteo";
  if (source.includes("Forecast")) return "prognoză meteo Open-Meteo";
  if (source.includes("Geocoding")) return "geolocalizare Open-Meteo";
  if (source.includes("GPS")) return "GPS browser";
  return source;
}

function distanceLabel(value: number | null) {
  if (value === null) return "n/d";
  return `${new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 1000)} km`;
}

function darkAlertSx(kind: "error" | "info" | "warning") {
  const color =
    kind === "error" ? "#ff5c7a" : kind === "warning" ? "#ffd166" : "#61f4de";
  return {
    border: `1px solid ${color}`,
    background: `${color}18`,
    color: "#f5fbff",
  };
}

const skeletonSx = {
  bgcolor: "rgba(255,255,255,0.08)",
};
