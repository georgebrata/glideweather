"use client";

import AirIcon from "@mui/icons-material/Air";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, LinearProgress, Skeleton, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  estimateCloudBaseMeters,
  favorableUntilMessage,
  formatCloudBaseDisplay,
  minutesSinceUpdate,
  nextSixHourSlots,
  ringStatusLabel,
  verdictHeadline,
  visibilityClarityLabel,
} from "../../lib/flightPresentation";
import {
  CurrentSnapshot,
  DayForecast,
  numberLabel,
  percentLabel,
  windDirectionLabel,
} from "../../lib/weather";
import { flightTokensByMode, statusToneByMode, type ThemeMode } from "../../theme/flightTokens";
import { useLocaleText } from "./LocaleContext";

function distanceKm(value: number | null, locale: string) {
  if (value === null) return "—";
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value / 1000)} km`;
}

export const FlightStatusPanel = ({
  snapshot,
  forecast,
  themeMode,
  loading,
  onOpenFullForecast,
}: {
  snapshot?: CurrentSnapshot;
  forecast?: DayForecast;
  themeMode: ThemeMode;
  loading: boolean;
  onOpenFullForecast: () => void;
}) => {
  const theme = useTheme();
  const { locale, t } = useLocaleText();
  const tokens = flightTokensByMode[themeMode];

  if (loading || !snapshot) {
    return (
      <Stack spacing={2} sx={{ p: { xs: 2, md: 2.5 }, height: "100%" }}>
        <Skeleton variant="rounded" height={140} />
        <Skeleton variant="rounded" height={88} />
        <Skeleton variant="rounded" height={180} />
      </Stack>
    );
  }

  const sample = snapshot.sample;
  const verdict = snapshot.verdict;
  const tone = statusToneByMode[themeMode][verdict.status];
  const angle = Math.max(0, Math.min(360, Math.round(verdict.score * 3.6)));
  const cloudBase = estimateCloudBaseMeters(sample.temperature, sample.humidity);
  const cloudDisplay = formatCloudBaseDisplay(cloudBase, snapshot.elevation, locale);
  const hourly = forecast?.samples ?? [];
  const slots = nextSixHourSlots(hourly, snapshot.timezone, locale);
  const maxWindMs = Math.max(...slots.map((slot) => slot.windMs ?? 0), 1);

  return (
    <Stack spacing={2.25} sx={{ p: { xs: 2, md: 2.5 }, height: "100%" }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ letterSpacing: "0.12em", fontSize: "0.68rem", color: "text.secondary", fontWeight: 600 }}
        >
          {t.flightWindow.flightStatus}
        </Typography>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main" }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.68rem", letterSpacing: "0.08em" }}>
            {minutesSinceUpdate(sample.time, locale)}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Box
          aria-label={t.common.scoreOutOf100(verdict.score)}
          role="img"
          sx={{
            width: 108,
            height: 108,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            background: `conic-gradient(${tone.color} 0deg ${angle}deg, ${alpha(theme.palette.text.primary, 0.1)} ${angle}deg 360deg)`,
            "&::before": {
              content: '""',
              position: "absolute",
              width: 84,
              height: 84,
              borderRadius: "50%",
              bgcolor: "var(--card)",
            },
            position: "relative",
          }}
        >
          <Typography sx={{ position: "relative", zIndex: 1, fontWeight: 800, fontSize: "1.65rem", color: tone.color }}>
            {ringStatusLabel(verdict.status, locale)}
          </Typography>
        </Box>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography variant="h2" sx={{ fontSize: "1.35rem" }}>
            {verdictHeadline(verdict, locale)}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {favorableUntilMessage(hourly, verdict.status, snapshot.timezone, locale)}
          </Typography>
        </Stack>
      </Stack>

      <Box>
        <Stack direction="row" sx={{ mb: 0.75, justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
            {t.flightWindow.flightConfidence}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{percentLabel(verdict.score, locale)}</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={verdict.score}
          sx={{
            height: 8,
            borderRadius: 999,
            bgcolor: alpha(tone.color, 0.12),
            "& .MuiLinearProgress-bar": { bgcolor: tone.color, borderRadius: 999 },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 0,
          border: "1px solid var(--border-flight)",
          borderRadius: `${tokens.innerRadius}px`,
          overflow: "hidden",
          bgcolor: "var(--card)",
        }}
      >
        <MetricCell
          icon={<AirIcon sx={{ fontSize: 18 }} />}
          label={t.flightWindow.wind}
          value={numberLabel(sample.windSpeed, "km/h", 0, locale)}
          sub={`${windDirectionLabel(sample.windDirection, locale)} · ${t.flightWindow.gustsLabel(numberLabel(sample.windGusts, "km/h", 0, locale))}`}
        />
        <MetricCell
          icon={<CloudQueueIcon sx={{ fontSize: 18 }} />}
          label={t.flightWindow.cloudBase}
          value={cloudDisplay.primary}
          sub={cloudDisplay.secondary}
          bordered
        />
        <MetricCell
          icon={<VisibilityIcon sx={{ fontSize: 18 }} />}
          label={t.flightWindow.visibility}
          value={distanceKm(sample.visibility, locale)}
          sub={visibilityClarityLabel(sample.visibility, locale)}
          bordered
        />
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Stack direction="row" sx={{ mb: 1.25, justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" sx={{ letterSpacing: "0.12em", fontSize: "0.68rem", color: "text.secondary", fontWeight: 600 }}>
            {t.flightWindow.next6Hours}
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={onOpenFullForecast}
            sx={{
              border: "none",
              bgcolor: "transparent",
              color: "primary.main",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.25,
              font: "inherit",
              fontWeight: 650,
              p: 0,
            }}
          >
            {t.flightWindow.fullForecast}
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.max(slots.length, 1)}, minmax(0, 1fr))`,
            gap: 1,
            alignItems: "end",
            flex: 1,
            minHeight: 140,
          }}
        >
          {slots.map((slot) => {
            const barHeight = slot.windMs === null ? 8 : 24 + (slot.windMs / maxWindMs) * 72;
            const barColor = slot.barTone === "ideal" ? tokens.accent : tokens.amber;
            return (
              <Stack key={slot.sample.time} spacing={0.75} sx={{ height: "100%", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                  {slot.temperature === null ? "—" : `${Math.round(slot.temperature)}°`}
                </Typography>
                <Box sx={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%", justifyContent: "center" }}>
                  <Box
                    sx={{
                      width: "42%",
                      maxWidth: 28,
                      height: barHeight,
                      borderRadius: 999,
                      bgcolor: barColor,
                      opacity: slot.barTone === "ideal" ? 0.95 : 0.85,
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
                  {slot.label}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                  {slot.windMs === null ? "—" : slot.windMs.toFixed(1)}
                </Typography>
              </Stack>
            );
          })}
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
          <LegendDot color={tokens.accent} label={t.flightWindow.idealWindow} />
          <LegendDot color={tokens.amber} label={t.flightWindow.increasingWind} />
        </Stack>
      </Box>
    </Stack>
  );
};

const MetricCell = ({
  icon,
  label,
  value,
  sub,
  bordered,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  bordered?: boolean;
}) => (
  <Stack
    spacing={0.75}
    sx={{
      p: 1.5,
      borderLeft: bordered ? "1px solid var(--border-flight)" : undefined,
      minWidth: 0,
    }}
  >
    <Stack direction="row" spacing={0.5} sx={{ color: "text.secondary", alignItems: "center" }}>
      {icon}
      <Typography variant="body2" sx={{ fontSize: "0.65rem", letterSpacing: "0.1em" }}>
        {label}
      </Typography>
    </Stack>
    <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2 }}>{value}</Typography>
    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem", lineHeight: 1.3 }}>
      {sub}
    </Typography>
  </Stack>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
      {label}
    </Typography>
  </Stack>
);
