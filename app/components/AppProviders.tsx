"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { getTranslations } from "../i18n";
import { createAppTheme } from "../theme/createAppTheme";
import { LocaleContext } from "./dashboard/LocaleContext";
import {
  getServerLocale,
  getServerThemeMode,
  readInitialLocale,
  readInitialThemeMode,
  subscribeLocale,
  subscribeThemeMode,
} from "./dashboard/themeStore";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 1000 * 60 * 8 },
        },
      }),
  );
  const themeMode = useSyncExternalStore(
    subscribeThemeMode,
    readInitialThemeMode,
    getServerThemeMode,
  );
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);
  const locale = useSyncExternalStore(subscribeLocale, readInitialLocale, getServerLocale);
  const t = useMemo(() => getTranslations(locale), [locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
    document.documentElement.lang = t.meta.documentLang;
  }, [t.meta.documentLang, themeMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocaleContext.Provider value={{ locale, t }}>{children}</LocaleContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
