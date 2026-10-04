"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { destinationToLocationChoice } from "../lib/destinationLocation";
import {
  defaultAppLocaleForContent,
  pathAfterLocaleChange,
} from "../lib/localeNavigation";
import type { ContentLocale } from "../seo/types";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Skeleton } from "@/app/components/ui/skeleton";
import { getTranslations } from "../i18n";
import {
  parseUserPreferences,
  resolveThemeMode,
  storedLocationToChoice,
  updateUserPreferences,
} from "../lib/userPreferences";
import { trackSearch } from "../lib/analytics";
import {
  dateForOffset,
  fetchCurrentSnapshot,
  fetchDayForecast,
  formatTime,
  providerDisplayName,
  searchLocations,
  type LocationChoice,
} from "../lib/weather";
import { flightTokensByMode, type ThemeMode } from "../theme/flightTokens";
import { AppProviders } from "./AppProviders";
import { AppHeader } from "./dashboard/AppHeader";
import { ConsoleGuideNav } from "./dashboard/ConsoleGuideNav";
import { ForecastDrawer } from "./dashboard/ForecastDrawer";
const FlightMap = dynamic(
  () => import("./dashboard/FlightMap").then((module) => ({ default: module.FlightMap })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[420px] w-full rounded-none" />,
  },
);
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
  mapboxAccessToken: string;
  contentLocale: ContentLocale;
  initialSiteId?: string;
};

export default function GlideWeatherApp({
  authEnabled: authOn,
  mapboxAccessToken,
  contentLocale,
  initialSiteId,
}: GlideWeatherAppProps) {
  const initialAppLocale = defaultAppLocaleForContent(contentLocale);
  return (
    <AppProviders initialAppLocale={initialAppLocale}>
      {authOn ? (
        <DashboardRootWithAuth
          mapboxAccessToken={mapboxAccessToken}
          contentLocale={contentLocale}
          initialSiteId={initialSiteId}
        />
      ) : (
        <DashboardRootPublic
          mapboxAccessToken={mapboxAccessToken}
          contentLocale={contentLocale}
          initialSiteId={initialSiteId}
        />
      )}
    </AppProviders>
  );
}

type DashboardRootProps = {
  mapboxAccessToken: string;
  contentLocale: ContentLocale;
  initialSiteId?: string;
};

function DashboardRootPublic({ mapboxAccessToken, contentLocale, initialSiteId }: DashboardRootProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocaleText();
  const themeMode = useSyncExternalStore(subscribeThemeMode, readInitialThemeMode, getServerThemeMode);
  const setLocale = useCallback(
    (nextLocale: typeof locale) => {
      writeLocale(nextLocale);
      router.push(pathAfterLocaleChange(pathname, nextLocale));
    },
    [pathname, router],
  );

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
      mapboxAccessToken={mapboxAccessToken}
      contentLocale={contentLocale}
      initialSiteId={initialSiteId}
    />
  );
}

function DashboardRootWithAuth({ mapboxAccessToken, contentLocale, initialSiteId }: DashboardRootProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocaleText();
  const { isLoaded: authLoaded, isSignedIn, user } = useUser();
  const themeMode = useSyncExternalStore(subscribeThemeMode, readInitialThemeMode, getServerThemeMode);
  const setLocale = useCallback(
    (nextLocale: typeof locale) => {
      writeLocale(nextLocale);
      router.push(pathAfterLocaleChange(pathname, nextLocale));
    },
    [pathname, router],
  );

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
      mapboxAccessToken={mapboxAccessToken}
      contentLocale={contentLocale}
      initialSiteId={initialSiteId}
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
  mapboxAccessToken,
  contentLocale,
  initialSiteId,
}: {
  authEnabled: boolean;
  authLoaded: boolean;
  isSignedIn: boolean;
  user: ReturnType<typeof useUser>["user"];
  locale: ReturnType<typeof readInitialLocale>;
  setLocale: (locale: ReturnType<typeof readInitialLocale>) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  mapboxAccessToken: string;
  contentLocale: ContentLocale;
  initialSiteId?: string;
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
  const siteBootstrapRef = useRef(false);

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
        trackSearch("browser");
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
    if (!authLoaded || initialLocationReady || siteBootstrapRef.current) {
      return;
    }

    if (initialSiteId) {
      const fromSite = destinationToLocationChoice(initialSiteId, contentLocale);
      if (fromSite) {
        siteBootstrapRef.current = true;
        setLocation(fromSite);
        setLocationNotice(null);
        setLocating(false);
        setInitialLocationReady(true);
        return;
      }
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
  }, [
    authLoaded,
    contentLocale,
    initialLocationReady,
    initialSiteId,
    isSignedIn,
    requestLocation,
    user,
  ]);
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

  const selectLocationFromSearch = useCallback(
    (next: LocationChoice) => {
      trackSearch("result");
      selectLocation(next);
    },
    [selectLocation],
  );

  const selectLocationFromMap = useCallback(
    (next: LocationChoice) => {
      trackSearch("map");
      selectLocation(next);
    },
    [selectLocation],
  );

  const modelUpdatedLabel = currentQuery.data
    ? t.flightWindow.modelUpdated(formatTime(currentQuery.data.sample.time, currentQuery.data.timezone, locale))
    : null;
  const providerLabel = currentQuery.data
    ? providerDisplayName(currentQuery.data.provider)
    : null;

  const verdictAnnouncement = useMemo(() => {
    if (!currentQuery.data) return "";
    const verdict = currentQuery.data.verdict;
    return `${t.common.scoreOutOf100(verdict.score)}. ${verdict.reasons[0] ?? t.decision.noCriticalReasons}`;
  }, [currentQuery.data, t]);

  const attributionFallback =
    providerLabel != null
      ? `${t.header.productChip} · ${providerLabel} · ${
          contentLocale === "ro"
            ? "Ajutor la decizie, nu autorizare de zbor."
            : "Decision aid, not flight authorization."
        }`
      : t.flightWindow.footerAttribution;

  return (
    <main id="main-content" className="nocturne-canvas min-h-screen text-foreground">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {verdictAnnouncement}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 md:px-6 md:py-8">
        <AppHeader
          authEnabled={authEnabled}
          locating={locating}
          onRequestLocation={requestLocation}
          onSelectLocation={selectLocationFromSearch}
          searchData={searchQuery.data ?? []}
          searchFetching={searchQuery.isFetching}
          searchText={searchText}
          setSearchText={setSearchText}
          locale={locale}
          setLocale={setLocale}
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}
        />

        <ConsoleGuideNav contentLocale={contentLocale} />

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
                accessToken={mapboxAccessToken}
                location={location}
                themeMode={themeMode}
                onLocationChange={selectLocationFromMap}
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

        <p className="text-sm text-muted-foreground">{t.decision.disclaimer}</p>

        <div className="flex flex-col justify-between gap-2 pt-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            <span>{modelUpdatedLabel ?? attributionFallback}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {providerLabel ?? "—"}
            {currentQuery.data?.provider.fallback ? " (fallback)" : ""}
          </span>
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
