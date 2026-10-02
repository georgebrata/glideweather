"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Skeleton } from "@/app/components/ui/skeleton";
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

type GlideWeatherAppProps = {
  authEnabled: boolean;
};

export default function GlideWeatherApp({ authEnabled: authOn }: GlideWeatherAppProps) {
  return (
    <AppProviders>
      {authOn ? <DashboardRootWithAuth /> : <DashboardRootPublic />}
    </AppProviders>
  );
}

function DashboardRootPublic() {
  const { locale } = useLocaleText();
  const themeMode = useSyncExternalStore(subscribeThemeMode, readInitialThemeMode, getServerThemeMode);
  const setLocale = useCallback((nextLocale: typeof locale) => {
    writeLocale(nextLocale);
  }, []);

  const toggleThemeMode = useCallback(() => {
    const nextMode: ThemeMode = themeMode === "dark" ? "light" : "dark";
    writeThemeMode(nextMode);
  }, [themeMode]);

  return (
    <FlightWindowDashboard
      authEnabled={false}
      authLoaded={true}
      isSignedIn={false}
      user={null}
      locale={locale}
      setLocale={setLocale}
      themeMode={themeMode}
      toggleThemeMode={toggleThemeMode}
    />
  );
}

function DashboardRootWithAuth() {
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
      authEnabled={true}
      authLoaded={authLoaded}
      isSignedIn={isSignedIn ?? false}
      user={user}
      locale={locale}
      setLocale={setLocale}
      themeMode={themeMode}
      toggleThemeMode={toggleThemeMode}
    />
  );
}

function FlightWindowDashboard({
  authEnabled,
  authLoaded,
  isSignedIn,
  user,
  locale,
  setLocale,
  themeMode,
  toggleThemeMode,
}: {
  authEnabled: boolean;
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
    <main className="nocturne-canvas min-h-screen text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 md:px-6 md:py-8">
        <AppHeader
          authEnabled={authEnabled}
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
          <Alert variant="default" className="border-[var(--border-flight)] bg-card">
            <AlertDescription className="flex items-center justify-between gap-3">
              <span>
                {locationNotice === "unavailable" ? t.location.unavailable : t.location.permissionDenied}
              </span>
              <button
                type="button"
                className="text-sm font-medium text-primary"
                onClick={() => setLocationNotice(null)}
              >
                {t.language.close}
              </button>
            </AlertDescription>
          </Alert>
        ) : null}

        <div
          className="instrument-console grid min-h-0 lg:min-h-[560px] lg:grid-cols-[58fr_42fr]"
          style={{ borderRadius: tokens.shellRadius }}
        >
          <div className="min-h-[320px] lg:min-h-0">
            {((!authLoaded || !initialLocationReady || locating) && !location) ? (
              <Skeleton className="h-[420px] w-full rounded-none" />
            ) : (
              <FlightMap
                location={location}
                themeMode={themeMode}
                onLocationChange={selectLocation}
                onOpenSites={() => setSitesOpen(true)}
              />
            )}
          </div>
          <div className="border-t border-[var(--border-flight)] lg:border-t-0 lg:border-l">
            <FlightStatusPanel
              snapshot={currentQuery.data}
              forecast={todayForecastQuery.data}
              themeMode={themeMode}
              loading={locating || currentQuery.isLoading || !location}
              onOpenFullForecast={() => setForecastOpen(true)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 pt-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            <span>{modelUpdatedLabel ?? t.flightWindow.footerAttribution}</span>
          </div>
          <span className="text-sm text-muted-foreground">Open-Meteo</span>
        </div>
      </div>

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
    </main>
  );
}
