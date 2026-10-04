"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { glideClerkAppearance } from "@/app/lib/clerkAppearance";
import { LoginAnalytics } from "@/app/components/analytics/LoginAnalytics";

export const ClerkAppShell = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider appearance={glideClerkAppearance}>
    <LoginAnalytics />
    {children}
  </ClerkProvider>
);
