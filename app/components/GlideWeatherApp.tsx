"use client";

import { useUser } from "@clerk/nextjs";
import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { getTranslations } from "../i18n";
import {
  parseUserPreferences,
  resolveThemeMode,
  storedLocationToChoice,
  updateUserPreferences,
} from "../lib/userPreferences";
import {
  dateForOffset,
  fetchCurrentSnapshot,
  fetchDayForecast,
  formatTime,
  searchLocations,
  type LocationChoice,
} from "../lib/weather";
import { flightTokensByMode, type ThemeMode } from "../theme/flightTokens";
import { AppProviders } from "./AppProviders";
import { AppHeader } from "./dashboard/AppHeader";
import { ForecastDrawer } from "./dashboard/ForecastDrawer";
import { FlightMap } from "./dashboard/FlightMap";
import { FlightStatusPanel } from "./dashboard/FlightStatusPanel";
import { useLocaleText } from "./dashboard/LocaleContext";
import { SitesDrawer } from "./dashboard/SitesDrawer";
import {
  getServerThemeMode,
  readInitialLocale,
  readInitialThemeMode,
  subscribeThemeMode,
  writeLocale,
  writeThemeMode,
} from "./dashboard/themeStore";

export default function GlideWeatherApp() {
  return (
    <AppProviders>
      <DashboardRoot />
    </AppProviders>
  );
}

function DashboardRoot() {
  const { locale } = useLocaleText();
  const { isLoaded: authLoaded, isSignedIn, user } = useUser();
  const themeMode = useSyncExternalStore(subscribeThemeMode, readInitialThemeMode, getServerThemeMode);
  const setLocale = useCallback((nextLocale: typeof locale) => {
    writeLocale(nextLocale);
  }, []);

  const toggleThemeMode = useCallback(() => {
    const nextMode: ThemeMode = themeMode === "dark" ? "light" : "dark";
    writeThemeMode(nextMode);
    if (isSignedIn && user) {
      void updateUserPreferences(user, { theme: nextMode }).catch(() => undefined);
    }
  }, [isSignedIn, themeMode, user]);

  return (
    <FlightWindowDashboard
      authLoaded={authLoaded}
      isSignedIn={isSignedIn}
      user={user}
      locale={locale}
      setLocale={setLocale}
      themeMode={themeMode}
      toggleThemeMode={toggleThemeMode}
    />
  );
}

function FlightWindowDashboard({
  authLoaded,
  isSignedIn,
  user,
  locale,
  setLocale,
  themeMode,
  toggleThemeMode,
}: {
  authLoaded: boolean;
  isSignedIn: boolean;
  user: ReturnType<typeof useUser>["user"];
  locale: ReturnType<typeof readInitialLocale>;
  setLocale: (locale: ReturnType<typeof readInitialLocale>) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}) {
  const { t } = useLocaleText();
  const tokens = flightTokensByMode[themeMode];
  const [location, setLocation] = useState<LocationChoice | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<"unavailable" | "denied" | null>(null);
  const [searchText, setSearchText] = useState("");
  const [forecastOpen, setForecastOpen] = useState(false);
  const [sitesOpen, setSitesOpen] = useState(false);
  const [initialLocationReady, setInitialLocationReady] = useState(false);
  const localeRef = useRef(locale);
  const preferencesAppliedRef = useRef(false);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationNotice("unavailable");
      setLocation(null);
      setLocating(false);
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
        setLocationNotice("denied");
        setLocation(null);
        setActiveTab(0);
        setLocating(false);
      },
      { enableHighAccuracy: false, maximumAge: 1000 * 60 * 10, timeout: 10000 },
    );
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- bootstrap dashboard location from Clerk metadata or GPS once */
  useEffect(() => {
    if (!authLoaded || initialLocationReady) {
      return;
    }

    if (isSignedIn && user) {
      if (preferencesAppliedRef.current) {
        return;
      }
      preferencesAppliedRef.current = true;

      const preferences = parseUserPreferences(user.unsafeMetadata);
      if (preferences?.theme) {
        writeThemeMode(resolveThemeMode(preferences.theme));
      }

      if (preferences?.defaultLocation) {
        setLocation(storedLocationToChoice(preferences.defaultLocation));
        setLocationNotice(null);
        setLocating(false);
      } else {
        requestLocation();
      }

      setInitialLocationReady(true);
      return;
    }

    if (!isSignedIn) {
      requestLocation();
      setInitialLocationReady(true);
    }
  }, [authLoaded, initialLocationReady, isSignedIn, requestLocation, user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const currentQuery = useQuery({
    queryKey: ["current-weather", location?.latitude, location?.longitude, locale],
    queryFn: () => fetchCurrentSnapshot(location as LocationChoice, locale),
    enabled: Boolean(location),
    refetchInterval: 1000 * 60 * 12,
  });

  const today = useMemo(() => dateForOffset(0), []);
  const todayForecastQuery = useQuery({
    queryKey: ["day-forecast", location?.latitude, location?.longitude, today, locale],
    queryFn: () => fetchDayForecast(location as LocationChoice, today, locale),
    enabled: Boolean(location),
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

  const modelUpdatedLabel = currentQuery.data
    ? t.flightWindow.modelUpdated(formatTime(currentQuery.data.sample.time, currentQuery.data.timezone, locale))
    : null;

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Stack spacing={2.5} sx={{ mx: "auto", maxWidth: 1280, px: { xs: 2, md: 3 }, py: { xs: 2.5, md: 3.5 } }}>
        <AppHeader
          locating={locating}
          onRequestLocation={requestLocation}
          onSelectLocation={selectLocation}
          searchData={searchQuery.data ?? []}
          searchFetching={searchQuery.isFetching}
          searchText={searchText}
          setSearchText={setSearchText}
          locale={locale}
          setLocale={setLocale}
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}
        />

        {locationNotice ? (
          <Alert severity="warning" onClose={() => setLocationNotice(null)}>
            {locationNotice === "unavailable" ? t.location.unavailable : t.location.permissionDenied}
          </Alert>
        ) : null}

        <Box
          sx={{
            border: "1px solid var(--border-flight)",
            borderRadius: `${tokens.shellRadius}px`,
            bgcolor: "background.paper",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "58fr 42fr" },
            minHeight: { xs: "auto", lg: 560 },
          }}
        >
          <Box sx={{ minHeight: { xs: 320, lg: "auto" } }}>
            {(!authLoaded || !initialLocationReady || locating) && !location ? (
              <Skeleton variant="rectangular" height={420} />
            ) : (
              <FlightMap
                location={location}
                themeMode={themeMode}
                onLocationChange={selectLocation}
                onOpenSites={() => setSitesOpen(true)}
              />
            )}
          </Box>
          <Box sx={{ borderTop: { xs: "1px solid var(--border-flight)", lg: "none" }, borderLeft: { lg: "1px solid var(--border-flight)" } }}>
            <FlightStatusPanel
              snapshot={currentQuery.data}
              forecast={todayForecastQuery.data}
              themeMode={themeMode}
              loading={locating || currentQuery.isLoading || !location}
              onOpenFullForecast={() => setForecastOpen(true)}
            />
          </Box>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1} sx={{ pt: 0.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {modelUpdatedLabel ?? t.flightWindow.footerAttribution}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Open-Meteo
          </Typography>
        </Stack>
      </Stack>

      {location ? (
        <ForecastDrawer
          open={forecastOpen}
          onClose={() => setForecastOpen(false)}
          location={location}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentQuery={currentQuery}
          themeMode={themeMode}
        />
      ) : null}

      <SitesDrawer
        open={sitesOpen}
        onClose={() => setSitesOpen(false)}
        location={location}
        onSelectLocation={selectLocation}
      />
    </Box>
  );
}
