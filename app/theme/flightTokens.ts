export type ThemeMode = "dark" | "light";

export type FlightDesignTokens = {
  page: string;
  panel: string;
  card: string;
  border: string;
  accent: string;
  accentMuted: string;
  amber: string;
  textPrimary: string;
  textMuted: string;
  shellRadius: number;
  innerRadius: number;
};

export const flightTokensByMode: Record<ThemeMode, FlightDesignTokens> = {
  dark: {
    page: "#071410",
    panel: "#0d1c18",
    card: "#10241f",
    border: "rgba(140, 255, 214, 0.14)",
    accent: "#3dffc8",
    accentMuted: "rgba(61, 255, 200, 0.16)",
    amber: "#e6c15a",
    textPrimary: "#f4fffb",
    textMuted: "#8aa399",
    shellRadius: 24,
    innerRadius: 16,
  },
  light: {
    page: "#e7f2ec",
    panel: "#f7fbf8",
    card: "#ffffff",
    border: "rgba(11, 143, 120, 0.18)",
    accent: "#0b8f78",
    accentMuted: "rgba(11, 143, 120, 0.12)",
    amber: "#9a6b12",
    textPrimary: "#10241c",
    textMuted: "#5c756c",
    shellRadius: 24,
    innerRadius: 16,
  },
};

export const statusToneByMode: Record<
  ThemeMode,
  Record<"good" | "marginal" | "no-go", { color: string; dim: string }>
> = {
  dark: {
    good: { color: "#3dffc8", dim: "rgba(61, 255, 200, 0.14)" },
    marginal: { color: "#e6c15a", dim: "rgba(230, 193, 90, 0.16)" },
    "no-go": { color: "#ff6b8a", dim: "rgba(255, 107, 138, 0.16)" },
  },
  light: {
    good: { color: "#0b8f78", dim: "rgba(11, 143, 120, 0.12)" },
    marginal: { color: "#9a6b12", dim: "rgba(154, 107, 18, 0.14)" },
    "no-go": { color: "#be123c", dim: "rgba(190, 18, 60, 0.12)" },
  },
};
