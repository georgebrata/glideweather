import { createTheme } from "@mui/material/styles";
import { flightTokensByMode, statusToneByMode, type ThemeMode } from "./flightTokens";

export function createAppTheme(mode: ThemeMode) {
  const tokens = flightTokensByMode[mode];
  const isLight = mode === "light";
  const tones = statusToneByMode[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.accent,
        contrastText: isLight ? "#ffffff" : "#041116",
      },
      secondary: { main: tokens.amber },
      error: { main: tones["no-go"].color },
      success: { main: tones.good.color },
      warning: { main: tokens.amber },
      background: {
        default: tokens.page,
        paper: tokens.panel,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textMuted,
      },
    },
    shape: { borderRadius: tokens.innerRadius },
    typography: {
      fontFamily:
        'var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontSize: "clamp(1.75rem, 3vw, 2.35rem)", lineHeight: 1.15, fontWeight: 700 },
      h2: { fontSize: "1.35rem", lineHeight: 1.2, fontWeight: 700 },
      h3: { fontSize: "1.05rem", lineHeight: 1.25, fontWeight: 700 },
      body1: { lineHeight: 1.5 },
      body2: { lineHeight: 1.45, fontSize: "0.875rem" },
      button: { textTransform: "none", fontWeight: 650 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: tokens.page,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            minHeight: 40,
          },
        },
      },
    },
  });
}
