import type { Metadata } from "next";
import { DestinationsHubView } from "@/app/components/site/DestinationsHubView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("destinationsHub", "en");
}

export default function DestinationsPage() {
  return <DestinationsHubView locale="en" />;
}
