"use client";

import GlideWeatherApp from "@/app/components/GlideWeatherApp";
import { HomeIntroSection } from "./HomeIntroSection";
import { ConsoleShell } from "./ConsoleShell";
import type { ContentLocale } from "@/app/seo/types";

export const HomePageClient = ({
  authEnabled,
  mapboxAccessToken,
  contentLocale,
  initialSiteId,
}: {
  authEnabled: boolean;
  mapboxAccessToken: string;
  contentLocale: ContentLocale;
  initialSiteId?: string;
}) => (
  <ConsoleShell locale={contentLocale} intro={<HomeIntroSection locale={contentLocale} />}>
    <GlideWeatherApp
      authEnabled={authEnabled}
      mapboxAccessToken={mapboxAccessToken}
      contentLocale={contentLocale}
      initialSiteId={initialSiteId}
    />
  </ConsoleShell>
);
