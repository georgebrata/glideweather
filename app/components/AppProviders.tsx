"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { getTranslations } from "../i18n";
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
  const locale = useSyncExternalStore(subscribeLocale, readInitialLocale, getServerLocale);
  const t = useMemo(() => getTranslations(locale), [locale]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = themeMode;
    root.style.colorScheme = themeMode;
    root.lang = t.meta.documentLang;
    root.classList.toggle("dark", themeMode === "dark");
    root.classList.toggle("light", themeMode === "light");
  }, [t.meta.documentLang, themeMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <LocaleContext.Provider value={{ locale, t }}>{children}</LocaleContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
