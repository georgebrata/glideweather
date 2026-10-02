"use client";

import AirIcon from "@mui/icons-material/Air";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  LinearProgress,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useMemo } from "react";
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

function panelSx(themeMode: ThemeMode) {
  return {
    border: "1px solid var(--border-flight)",
    borderRadius: 16,
    backgroundColor: "var(--card)",
  };
}

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
    <Stack spacing={2}>
      <Tabs
        value={activeTab}
        onChange={(_, nextValue: number) => setActiveTab(nextValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 40,
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTabs-flexContainer": { gap: 0.5 },
          "& .MuiTab-root.Mui-selected": {
            color: themeMode === "dark" ? "#041116" : "#fff",
            backgroundColor: "primary.main",
            borderRadius: 12,
          },
        }}
      >
        <Tab label={t.tabs.now} value={0} />
        {[1, 2, 3].map((offset) => (
          <Tab key={offset} label={formatDateLabel(dateForOffset(offset), locale)} value={offset} />
        ))}
      </Tabs>

      {activeTab === 0 ? (
        <CurrentDayDetail currentQuery={currentQuery} location={location} themeMode={themeMode} />
      ) : null}
      {[1, 2, 3].map((offset) => (
        <ForecastDayDetail key={offset} active={activeTab === offset} location={location} offset={offset} themeMode={themeMode} />
      ))}
    </Stack>
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
    return <Alert severity="error">{t.current.loadError(currentQuery.error.message)}</Alert>;
  }
  if (currentQuery.isLoading || !snapshot || !detailSample) {
    return <Skeleton variant="rounded" height={200} />;
  }

  return (
    <Stack spacing={2}>
      {currentQuery.isFetching ? <LinearProgress color="primary" /> : null}
      <VerdictPanel sample={snapshot.sample} verdict={snapshot.verdict} themeMode={themeMode} />
      <DetailRow sample={detailSample} timezone={snapshot.timezone} themeMode={themeMode} />
      {forecastQuery.data ? <LaunchWindowScanner forecast={forecastQuery.data} themeMode={themeMode} /> : null}
      <ExtraMetrics sample={detailSample} themeMode={themeMode} />
    </Stack>
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
    return <Alert severity="error">{t.forecast.loadError(forecastQuery.error.message)}</Alert>;
  }
  if (forecastQuery.isLoading || !forecastQuery.data) return <Skeleton variant="rounded" height={200} />;

  const forecast = forecastQuery.data;
  const sample = forecast.best.sample;

  return (
    <Stack spacing={2}>
      <DailySummary forecast={forecast} />
      <VerdictPanel contextTitle={t.forecast.bestWindow} sample={sample} verdict={forecast.best.verdict} themeMode={themeMode} />
      {sample ? <DetailRow sample={sample} timezone={forecast.timezone} themeMode={themeMode} /> : null}
      <LaunchWindowScanner forecast={forecast} themeMode={themeMode} />
      {sample ? <ExtraMetrics sample={sample} themeMode={themeMode} /> : null}
    </Stack>
  );
};

const DailySummary = ({ forecast }: { forecast: DayForecast }) => {
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
    <Box sx={{ ...panelSx(themeMode), p: 2 }}>
      <Stack spacing={1.25}>
        {contextTitle ? <Typography variant="h3">{contextTitle}</Typography> : null}
        <Typography variant="h2" sx={{ color: tone.color }}>{verdict.title}</Typography>
        {verdict.reasons.slice(0, 3).map((reason) => (
          <RiskLine key={reason} color={tone.color}>{reason}</RiskLine>
        ))}
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Fact icon={<AirIcon fontSize="small" />} label={t.decision.wind} value={sample ? numberLabel(sample.windSpeed, "km/h", 0, locale) : unavailable} />
          <Fact icon={<SpeedIcon fontSize="small" />} label={t.decision.gust} value={sample ? numberLabel(sample.windGusts, "km/h", 0, locale) : unavailable} />
          <Fact label={t.console.spread} value={sample ? numberLabel(gustSpreadOf(sample), "km/h", 0, locale) : unavailable} />
        </Stack>
      </Stack>
    </Box>
  );
};

const DetailRow = ({
  sample,
  timezone,
  themeMode,
}: {
  sample: WeatherSample;
  timezone: string;
  themeMode: ThemeMode;
}) => {
  const { locale, t } = useLocaleText();
  return (
    <Box sx={{ ...panelSx(themeMode), p: 2 }}>
      <Stack spacing={1.25}>
        <Typography variant="h3">{sample.weatherLabel}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t.atmosphere.updatedAt(formatTime(sample.time, timezone, locale))}
        </Typography>
        <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
          <Fact label={t.atmosphere.direction} value={windDirectionLabel(sample.windDirection, locale)} />
          <Fact label={t.atmosphere.temperature} value={numberLabel(sample.temperature, "C", 1, locale)} />
          <Fact label={t.metrics.visibility} value={distanceLabel(sample.visibility, locale, t.common.notAvailable)} />
          <Fact label={t.console.rain} value={percentLabel(sample.precipitationProbability, locale)} />
          <Fact label={t.console.cape} value={numberLabel(sample.cape, "J/kg", 0, locale)} />
        </Box>
      </Stack>
    </Box>
  );
};

const LaunchWindowScanner = ({ forecast, themeMode }: { forecast: DayForecast; themeMode: ThemeMode }) => {
  const { locale, t } = useLocaleText();
  return (
    <Stack spacing={1.25}>
      <Box>
        <Typography variant="h3">{t.console.windowsTitle}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>{t.console.windowsSubtitle}</Typography>
      </Box>
      {forecast.topWindows.length === 0 ? (
        <Alert severity="warning">{t.scanner.empty}</Alert>
      ) : (
        <Stack spacing={1}>
          {forecast.topWindows.map(({ sample, verdict }) => {
            const tone = statusToneByMode[themeMode][verdict.status];
            return (
              <Box key={sample.time} sx={{ ...panelSx(themeMode), p: 1.25, display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr", md: "88px 1fr 1fr" } }}>
                <Typography sx={{ fontWeight: 700 }}>{formatTime(sample.time, forecast.timezone, locale)}</Typography>
                <Typography variant="body2" sx={{ color: tone.color, fontWeight: 700 }}>{verdict.title}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {t.scanner.windGust(numberLabel(sample.windSpeed, "km/h", 0, locale), numberLabel(sample.windGusts, "km/h", 0, locale))}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

const ExtraMetrics = ({ sample, themeMode }: { sample: WeatherSample; themeMode: ThemeMode }) => {
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
    <Accordion disableGutters elevation={0} sx={{ ...panelSx(themeMode), "&:before": { display: "none" } }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 700 }}>{t.console.moreData}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" } }}>
          {items.map((item) => <Fact key={item.label} label={item.label} value={item.value} />)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const Fact = ({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) => (
  <Box>
    <Stack direction="row" spacing={0.5} sx={{ color: "text.secondary", alignItems: "center" }}>
      {icon}
      <Typography variant="body2">{label}</Typography>
    </Stack>
    <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
  </Box>
);

const RiskLine = ({ children, color }: { children: ReactNode; color: string }) => (
  <Stack direction="row" spacing={0.75} sx={{ alignItems: "flex-start" }}>
    <WarningAmberIcon sx={{ color, fontSize: 18, mt: "2px" }} />
    <Typography variant="body2">{children}</Typography>
  </Stack>
);
