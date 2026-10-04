import type { Metadata } from "next";
import { authEnabled } from "@/flags";
import { HomePageClient } from "@/app/components/site/HomePageClient";
import { JsonLd, homeJsonLd } from "@/app/seo/jsonld";
import { homeMetadata } from "@/app/seo/metadata";

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  return homeMetadata("en", params);
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const authOn = await authEnabled();
  const mapboxAccessToken = process.env.MAPBOX_PERSONAL_ACCESS_TOKEN?.trim() ?? "";

  return (
    <>
      <JsonLd data={homeJsonLd("en")} />
      <HomePageClient
        authEnabled={authOn}
        mapboxAccessToken={mapboxAccessToken}
        contentLocale="en"
        initialSiteId={params.site}
      />
    </>
  );
}
