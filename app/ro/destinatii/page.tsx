import type { Metadata } from "next";
import { DestinationsHubView } from "@/app/components/site/DestinationsHubView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("destinationsHub", "ro");
}

export default function DestinatiiPage() {
  return <DestinationsHubView locale="ro" />;
}
