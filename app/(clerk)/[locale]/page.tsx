import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authEnabled } from "@/flags";
import { HomePageClient } from "@/app/components/site/HomePageClient";
import { JsonLd, homeJsonLd } from "@/app/seo/jsonld";
import { homeMetadata } from "@/app/seo/metadata";
import { DYNAMIC_CONTENT_LOCALES } from "@/app/seo/routes";
import { isContentLocale, type ContentLocale } from "@/app/seo/types";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ site?: string }>;
};

function asDynamicLocale(value: string): ContentLocale | null {
  if (!isContentLocale(value)) return null;
  if (!DYNAMIC_CONTENT_LOCALES.some((entry) => entry.id === value)) return null;
  return value;
}

export function generateStaticParams() {
  return DYNAMIC_CONTENT_LOCALES.map((entry) => ({ locale: entry.id }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const contentLocale = asDynamicLocale(locale);
  if (!contentLocale) return {};
  const query = await searchParams;
  return homeMetadata(contentLocale, query);
}

export default async function LocalizedHome({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const contentLocale = asDynamicLocale(locale);
  if (!contentLocale) notFound();
  const query = await searchParams;
  const authOn = await authEnabled();
  const mapboxAccessToken = process.env.MAPBOX_PERSONAL_ACCESS_TOKEN?.trim() ?? "";

  return (
    <>
      <JsonLd data={homeJsonLd(contentLocale)} />
      <HomePageClient
        authEnabled={authOn}
        mapboxAccessToken={mapboxAccessToken}
        contentLocale={contentLocale}
        initialSiteId={query.site}
      />
    </>
  );
}
