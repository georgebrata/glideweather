import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationPageView } from "@/app/components/site/DestinationPageView";
import { DESTINATIONS, getDestinationBySlug } from "@/app/content/destinations";
import { buildDestinationMetadata } from "@/app/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return DESTINATIONS.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) return {};
  const title = `Meteo parapantă ${destination.names.ro} | GlideWeather`;
  return buildDestinationMetadata("ro", slug, title, destination.shortDescriptions.ro);
}

export default async function DestinationPageRo({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();
  return <DestinationPageView locale="ro" destination={destination} />;
}
