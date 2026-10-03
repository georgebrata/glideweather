"use client";

import { AlertTriangle, Gauge, Wind } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Progress } from "@/app/components/ui/progress";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { cn } from "@/app/lib/utils";
import {
  CurrentSnapshot,
  DayForecast,
  FlightStatus,
  WeatherSample,
  dateForOffset,
  fetchDayForecast,
  formatDateLabel,
  formatTime,
  numberLabel,
  percentLabel,
  windDirectionLabel,
} from "../../lib/weather";
import { statusToneByMode, type ThemeMode } from "../../theme/flightTokens";
import { useLocaleText } from "./LocaleContext";

const panelClass = "rounded-2xl border border-[var(--border-flight)] bg-card p-4";

function gustSpreadOf(sample: WeatherSample) {
  if (sample.windSpeed === null || sample.windGusts === null) return null;
  return sample.windGusts - sample.windSpeed;
}

function distanceLabel(value: number | null, locale: string, na: string) {
  if (value === null) return na;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value / 1000)} km`;
}

export const ForecastDetailPanels = ({
  location,
  activeTab,
  setActiveTab,
  currentQuery,
  themeMode,
}: {
  location: { latitude: number; longitude: number };
  activeTab: number;
  setActiveTab: (value: number) => void;
  currentQuery: ReturnType<typeof useQuery<CurrentSnapshot, Error>>;
  themeMode: ThemeMode;
}) => {
  const { locale, t } = useLocaleText();

  return (
    <Tabs value={String(activeTab)} onValueChange={(value) => setActiveTab(Number(value))} className="gap-4">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
        <TabsTrigger
          value="0"
          className="rounded-xl border border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {t.tabs.now}
        </TabsTrigger>
        {[1, 2, 3].map((offset) => (
          <TabsTrigger
            key={offset}
            value={String(offset)}
            className="rounded-xl border border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {formatDateLabel(dateForOffset(offset), locale)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="0" className="mt-0">
        <CurrentDayDetail currentQuery={currentQuery} location={location} themeMode={themeMode} />
      </TabsContent>
      {[1, 2, 3].map((offset) => (
        <TabsContent key={offset} value={String(offset)} className="mt-0">
          <ForecastDayDetail
            active={activeTab === offset}
            location={location}
            offset={offset}
            themeMode={themeMode}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

const CurrentDayDetail = ({
  currentQuery,
  location,
  themeMode,
}: {
  currentQuery: ReturnType<typeof useQuery<CurrentSnapshot, Error>>;
  location: { latitude: number; longitude: number };
  themeMode: ThemeMode;
}) => {
  const { locale, t } = useLocaleText();
  const date = useMemo(() => dateForOffset(0), []);
  const forecastQuery = useQuery({
    queryKey: ["day-forecast", location.latitude, location.longitude, date, locale],
    queryFn: () =>
      fetchDayForecast(
        { id: "drawer", name: "", latitude: location.latitude, longitude: location.longitude, source: "search" },
        date,
        locale,
      ),
  });
  const snapshot = currentQuery.data;
  const detailSample = useMemo(() => {
    if (!snapshot) return undefined;
    if (snapshot.sample.precipitationProbability !== null) return snapshot.sample;
    const hour = snapshot.sample.time.slice(0, 13);
    const match = forecastQuery.data?.samples.find((sample) => sample.time.slice(0, 13) === hour);
    return match ? { ...snapshot.sample, precipitationProbability: match.precipitationProbability } : snapshot.sample;
  }, [forecastQuery.data, snapshot]);

  if (currentQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t.current.loadError(currentQuery.error.message)}</AlertDescription>
      </Alert>
    );
  }
  if (currentQuery.isLoading || !snapshot || !detailSample) {
    return <Skeleton className="h-[200px] w-full rounded-2xl" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {currentQuery.isFetching ? <Progress value={100} className="h-1 animate-pulse" /> : null}
      <VerdictPanel sample={snapshot.sample} verdict={snapshot.verdict} themeMode={themeMode} />
      <DetailRow sample={detailSample} timezone={snapshot.timezone} />
      {forecastQuery.data ? <LaunchWindowScanner forecast={forecastQuery.data} themeMode={themeMode} /> : null}
      <ExtraMetrics sample={detailSample} />
    </div>
  );
};

const ForecastDayDetail = ({
  active,
  location,
  offset,
  themeMode,
}: {
  active: boolean;
  location: { latitude: number; longitude: number };
  offset: number;
  themeMode: ThemeMode;
}) => {
  const { locale, t } = useLocaleText();
  const date = useMemo(() => dateForOffset(offset), [offset]);
  const forecastQuery = useQuery({
    queryKey: ["day-forecast", location.latitude, location.longitude, date, locale],
    queryFn: () =>
      fetchDayForecast(
        { id: "drawer", name: "", latitude: location.latitude, longitude: location.longitude, source: "search" },
        date,
        locale,
      ),
    enabled: active,
  });

  if (!active) return null;
  if (forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t.forecast.loadError(forecastQuery.error.message)}</AlertDescription>
      </Alert>
    );
  }
  if (forecastQuery.isLoading || !forecastQuery.data) return <Skeleton className="h-[200px] w-full rounded-2xl" />;

  const forecast = forecastQuery.data;
  const sample = forecast.best.sample;

  return (
    <div className="flex flex-col gap-4">
      <DailySummary forecast={forecast} />
      <VerdictPanel
        contextTitle={t.forecast.bestWindow}
        sample={sample}
        verdict={forecast.best.verdict}
        themeMode={themeMode}
      />
      {sample ? <DetailRow sample={sample} timezone={forecast.timezone} /> : null}
      <LaunchWindowScanner forecast={forecast} themeMode={themeMode} />
      {sample ? <ExtraMetrics sample={sample} /> : null}
    </div>
  );
};

const DailySummary = ({ forecast }: { forecast: DayForecast }) => {
  const { locale, t } = useLocaleText();
  const sunSuffix = forecast.daily.sunriseCalculated ? ` (${t.metrics.calculatedSun})` : "";
  const parts = [
    `${t.daily.temperature} ${numberLabel(forecast.daily.temperatureMin, "C", 0, locale)} / ${numberLabel(forecast.daily.temperatureMax, "C", 0, locale)}`,
    `${t.daily.maxWind} ${numberLabel(forecast.daily.windSpeedMax, "km/h", 0, locale)}`,
    `${t.daily.maxGust} ${numberLabel(forecast.daily.windGustsMax, "km/h", 0, locale)}`,
    `${t.console.rain} ${percentLabel(forecast.daily.precipitationProbabilityMax, locale)}`,
    `${formatTime(forecast.daily.sunrise, forecast.timezone, locale)}–${formatTime(forecast.daily.sunset, forecast.timezone, locale)}${sunSuffix}`,
  ];
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{parts.join(" · ")}</p>
      {forecast.daily.predictabilityCaution ? (
        <p className="text-sm text-muted-foreground">{t.metrics.predictabilityLow}</p>
      ) : null}
    </div>
  );
};

const VerdictPanel = ({
  contextTitle,
  sample,
  verdict,
  themeMode,
}: {
  contextTitle?: string;
  sample: WeatherSample | null;
  verdict: { status: FlightStatus; title: string; score: number; reasons: string[] };
  themeMode: ThemeMode;
}) => {
  const { locale, t } = useLocaleText();
  const tone = statusToneByMode[themeMode][verdict.status];
  const unavailable = t.common.notAvailable;

  return (
    <div className={panelClass}>
      <div className="flex flex-col gap-3">
        {contextTitle ? <h3 className="text-lg font-semibold">{contextTitle}</h3> : null}
        <h2 className="text-xl font-bold" style={{ color: tone.color }}>
          {verdict.title}
        </h2>
        {verdict.reasons.slice(0, 3).map((reason) => (
          <RiskLine key={reason} color={tone.color}>
            {reason}
          </RiskLine>
        ))}
        <div className="flex flex-wrap gap-4">
          <Fact
            icon={<Wind className="size-4" />}
            label={t.decision.wind}
            value={sample ? numberLabel(sample.windSpeed, "km/h", 0, locale) : unavailable}
          />
          <Fact
            icon={<Gauge className="size-4" />}
            label={t.decision.gust}
            value={sample ? numberLabel(sample.windGusts, "km/h", 0, locale) : unavailable}
          />
          <Fact label={t.console.spread} value={sample ? numberLabel(gustSpreadOf(sample), "km/h", 0, locale) : unavailable} />
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ sample, timezone }: { sample: WeatherSample; timezone: string }) => {
  const { locale, t } = useLocaleText();
  const gustNote =
    sample.windGustOrigin === "latest-within-3h" && sample.windGustSourceTime
      ? t.metrics.gustFromTime(formatTime(sample.windGustSourceTime, timezone, locale))
      : null;
  return (
    <div className={panelClass}>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">{sample.weatherLabel}</h3>
        <p className="text-sm text-muted-foreground">
          {t.atmosphere.updatedAt(formatTime(sample.time, timezone, locale))}
        </p>
        {gustNote ? <p className="text-sm text-muted-foreground">{gustNote}</p> : null}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <Fact label={t.atmosphere.direction} value={windDirectionLabel(sample.windDirection, locale)} />
          <Fact label={t.atmosphere.temperature} value={numberLabel(sample.temperature, "C", 1, locale)} />
          <Fact label={t.metrics.visibility} value={distanceLabel(sample.visibility, locale, t.common.notAvailable)} />
          <Fact label={t.console.rain} value={percentLabel(sample.precipitationProbability, locale)} />
          <Fact label={t.console.cape} value={numberLabel(sample.cape, "J/kg", 0, locale)} />
        </div>
      </div>
    </div>
  );
};

const LaunchWindowScanner = ({ forecast, themeMode }: { forecast: DayForecast; themeMode: ThemeMode }) => {
  const { locale, t } = useLocaleText();
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-lg font-semibold">{t.console.windowsTitle}</h3>
        <p className="text-sm text-muted-foreground">{t.console.windowsSubtitle}</p>
      </div>
      {forecast.topWindows.length === 0 ? (
        <Alert>
          <AlertDescription>{t.scanner.empty}</AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col gap-2">
          {forecast.topWindows.map(({ sample, verdict }) => {
            const tone = statusToneByMode[themeMode][verdict.status];
            return (
              <div
                key={sample.time}
                className={cn(panelClass, "grid gap-2 p-3 md:grid-cols-[88px_1fr_1fr]")}
              >
                <p className="font-bold">{formatTime(sample.time, forecast.timezone, locale)}</p>
                <p className="text-sm font-bold" style={{ color: tone.color }}>
                  {verdict.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.scanner.windGust(
                    numberLabel(sample.windSpeed, "km/h", 0, locale),
                    numberLabel(sample.windGusts, "km/h", 0, locale),
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ExtraMetrics = ({ sample }: { sample: WeatherSample }) => {
  const { locale, t } = useLocaleText();
  const items = [
    { label: t.metrics.pressure, value: numberLabel(sample.pressure, "hPa", 0, locale) },
    ...(sample.seaLevelPressureHpa !== null && sample.seaLevelPressureHpa !== undefined
      ? [{ label: t.metrics.seaLevelPressure, value: numberLabel(sample.seaLevelPressureHpa, "hPa", 0, locale) }]
      : []),
    { label: t.console.humidity, value: percentLabel(sample.humidity, locale) },
    { label: t.metrics.clouds, value: percentLabel(sample.cloudCover, locale) },
    ...(sample.cloudCoverLow !== null && sample.cloudCoverLow !== undefined
      ? [{ label: t.metrics.cloudLow, value: percentLabel(sample.cloudCoverLow, locale) }]
      : []),
    ...(sample.cloudCoverMid !== null && sample.cloudCoverMid !== undefined
      ? [{ label: t.metrics.cloudMid, value: percentLabel(sample.cloudCoverMid, locale) }]
      : []),
    ...(sample.cloudCoverHigh !== null && sample.cloudCoverHigh !== undefined
      ? [{ label: t.metrics.cloudHigh, value: percentLabel(sample.cloudCoverHigh, locale) }]
      : []),
    ...(sample.windSpeed80mKmh !== null && sample.windSpeed80mKmh !== undefined
      ? [{ label: t.metrics.wind80m, value: numberLabel(sample.windSpeed80mKmh, "km/h", 0, locale) }]
      : []),
    ...(sample.liftedIndex !== null && sample.liftedIndex !== undefined
      ? [{ label: t.metrics.liftedIndex, value: numberLabel(sample.liftedIndex, "", 1, locale) }]
      : []),
    ...(sample.boundaryLayerHeightM !== null && sample.boundaryLayerHeightM !== undefined
      ? [{ label: t.metrics.boundaryLayer, value: numberLabel(sample.boundaryLayerHeightM, "m", 0, locale) }]
      : []),
    ...(sample.convectiveInhibitionJkg !== null && sample.convectiveInhibitionJkg !== undefined
      ? [{ label: t.metrics.convectiveInhibition, value: numberLabel(sample.convectiveInhibitionJkg, "J/kg", 0, locale) }]
      : []),
    { label: t.console.uv, value: numberLabel(sample.uvIndex, "", 1, locale) },
    { label: t.console.aqi, value: sample.usAqi === null ? t.common.notAvailable : String(Math.round(sample.usAqi)) },
    { label: t.console.pm25, value: numberLabel(sample.pm25, "ug/m3", 1, locale) },
  ];
  return (
    <Accordion type="single" collapsible className={cn(panelClass, "px-0 py-0")}>
      <AccordionItem value="more" className="border-none px-4">
        <AccordionTrigger className="py-4 font-bold hover:no-underline">{t.console.moreData}</AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4 pb-4 sm:grid-cols-2 md:grid-cols-3">
            {items.map((item) => (
              <Fact key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const Fact = ({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) => (
  <div>
    <div className="flex items-center gap-1 text-muted-foreground">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <p className="font-bold">{value}</p>
  </div>
);

const RiskLine = ({ children, color }: { children: ReactNode; color: string }) => (
  <div className="flex items-start gap-2">
    <AlertTriangle className="mt-0.5 size-4 shrink-0" style={{ color }} />
    <p className="text-sm">{children}</p>
  </div>
);
