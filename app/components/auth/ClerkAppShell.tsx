"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useMemo, useSyncExternalStore } from "react";
import { LoginAnalytics } from "@/app/components/analytics/LoginAnalytics";
import {
  getServerThemeMode,
  readInitialThemeMode,
  subscribeThemeMode,
} from "@/app/components/dashboard/themeStore";
import { glideClerkAppearance } from "@/app/lib/clerkAppearance";

export const ClerkAppShell = ({ children }: { children: React.ReactNode }) => {
  const themeMode = useSyncExternalStore(subscribeThemeMode, readInitialThemeMode, getServerThemeMode);
  const appearance = useMemo(() => glideClerkAppearance(themeMode), [themeMode]);

  return (
    <ClerkProvider appearance={appearance}>
      <LoginAnalytics />
      {children}
    </ClerkProvider>
  );
};
