import type { Metadata } from "next";
import Link from "next/link";
import { ContentPageShell } from "@/app/components/site/ContentPageShell";
import { buildPageMetadata } from "@/app/seo/metadata";
import { pathForRoute } from "@/app/seo/routes";

export const metadata: Metadata = buildPageMetadata("notFound", "en");

export default function NotFound() {
  return (
    <ContentPageShell locale="en" currentPath="/404">
      <div className="mx-auto max-w-lg px-4 py-20 text-center md:px-6">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you requested is not available. Return to the flight console or read the guides.
        </p>
        <div className="mt-8 flex flex-col gap-3 text-sm">
          <Link href={pathForRoute("home", "en")} className="text-primary hover:underline">
            Open GlideWeather flight console
          </Link>
          <Link href={pathForRoute("about", "en")} className="text-primary hover:underline">
            About GlideWeather
          </Link>
        </div>
      </div>
    </ContentPageShell>
  );
}
