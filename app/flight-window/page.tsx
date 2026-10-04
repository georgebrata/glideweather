import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("flightWindow", "en");
}

export default function FlightWindowPage() {
  return <GuidePageView locale="en" routeKey="flightWindow" />;
}
