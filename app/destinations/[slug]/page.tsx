import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationPageView } from "@/app/components/site/DestinationPageView";
import { DESTINATIONS, getDestinationBySlug, localizedText } from "@/app/content/destinations";
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
  const title = `${localizedText(destination.names, "en")} paragliding weather | GlideWeather`;
  return buildDestinationMetadata("en", slug, title, localizedText(destination.shortDescriptions, "en"));
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();
  return <DestinationPageView locale="en" destination={destination} />;
}
