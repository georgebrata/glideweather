"use client";

import { ChevronRight, Cloud, Eye, Wind } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Skeleton } from "@/app/components/ui/skeleton";
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
import { cn } from "@/app/lib/utils";
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
  const { locale, t } = useLocaleText();
  const tokens = flightTokensByMode[themeMode];

  if (loading || !snapshot) {
    return (
      <div className="flex h-full flex-col gap-4 p-4 md:p-5">
        <Skeleton className="h-[140px] w-full rounded-2xl" />
        <Skeleton className="h-[88px] w-full rounded-2xl" />
        <Skeleton className="h-[180px] w-full rounded-2xl" />
      </div>
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
  const ringTrack = themeMode === "dark" ? "rgba(244, 255, 251, 0.1)" : "rgba(16, 36, 28, 0.1)";

  return (
    <div className="flex h-full flex-col gap-5 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{t.flightWindow.flightStatus}</p>
        <div className="flex items-center gap-1.5 text-[0.68rem] tracking-wide text-muted-foreground uppercase">
          <span className="size-1.5 rounded-full bg-primary" />
          {minutesSinceUpdate(sample.time, locale)}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          aria-label={t.common.scoreOutOf100(verdict.score)}
          role="img"
          className="relative grid size-[108px] shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(${tone.color} 0deg ${angle}deg, ${ringTrack} ${angle}deg 360deg)`,
            boxShadow: `0 0 24px ${tone.dim}`,
          }}
        >
          <div className="absolute size-[84px] rounded-full bg-card" />
          <span
            className="relative z-10 text-[1.65rem] font-extrabold"
            style={{ color: tone.color }}
          >
            {ringStatusLabel(verdict.status, locale)}
          </span>
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="text-xl font-semibold leading-tight md:text-2xl">
            {verdictHeadline(verdict, locale)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {favorableUntilMessage(hourly, verdict.status, snapshot.timezone, locale)}
          </p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs tracking-widest text-muted-foreground uppercase">
          <span>{t.flightWindow.flightConfidence}</span>
          <span className="font-bold text-foreground">{percentLabel(verdict.score, locale)}</span>
        </div>
        <Progress value={verdict.score} className="h-2 bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]" />
      </div>

      <div
        className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[var(--border-flight)] bg-card"
        style={{ borderRadius: tokens.innerRadius }}
      >
        <MetricCell
          icon={<Wind className="size-4" />}
          label={t.flightWindow.wind}
          value={numberLabel(sample.windSpeed, "km/h", 0, locale)}
          sub={`${windDirectionLabel(sample.windDirection, locale)} · ${t.flightWindow.gustsLabel(numberLabel(sample.windGusts, "km/h", 0, locale))}`}
        />
        <MetricCell
          icon={<Cloud className="size-4" />}
          label={t.flightWindow.cloudBase}
          value={cloudDisplay.primary}
          sub={cloudDisplay.secondary}
          bordered
        />
        <MetricCell
          icon={<Eye className="size-4" />}
          label={t.flightWindow.visibility}
          value={distanceKm(sample.visibility, locale)}
          sub={visibilityClarityLabel(sample.visibility, locale)}
          bordered
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow">{t.flightWindow.next6Hours}</p>
          <Button
            type="button"
            variant="link"
            className="h-auto gap-0.5 p-0 text-sm font-semibold"
            onClick={onOpenFullForecast}
          >
            {t.flightWindow.fullForecast}
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div
          className="grid min-h-[140px] flex-1 items-end gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.max(slots.length, 1)}, minmax(0, 1fr))` }}
        >
          {slots.map((slot) => {
            const barHeight = slot.windMs === null ? 8 : 24 + (slot.windMs / maxWindMs) * 72;
            const barColor = slot.barTone === "ideal" ? tokens.accent : tokens.amber;
            return (
              <div key={slot.sample.time} className="flex h-full flex-col items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  {slot.temperature === null ? "—" : `${Math.round(slot.temperature)}°`}
                </span>
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className={cn(
                      "w-[42%] max-w-7 rounded-full",
                      slot.barTone === "ideal" ? "opacity-95 shadow-[0_0_12px_var(--accent)]" : "opacity-85",
                    )}
                    style={{ height: barHeight, backgroundColor: barColor }}
                  />
                </div>
                <span className="text-[0.72rem] text-muted-foreground">{slot.label}</span>
                <span className="telemetry text-sm font-bold">
                  {slot.windMs === null ? "—" : slot.windMs.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-4">
          <LegendDot color={tokens.accent} label={t.flightWindow.idealWindow} />
          <LegendDot color={tokens.amber} label={t.flightWindow.increasingWind} />
        </div>
      </div>
    </div>
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
  <div className={cn("min-w-0 space-y-1.5 p-3", bordered && "border-l border-[var(--border-flight)]")}>
    <div className="flex items-center gap-1 text-muted-foreground">
      {icon}
      <span className="text-[0.65rem] tracking-widest uppercase">{label}</span>
    </div>
    <p className="telemetry text-base font-bold leading-tight">{value}</p>
    <p className="text-xs leading-snug text-muted-foreground">{sub}</p>
  </div>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);
