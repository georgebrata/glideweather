import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("flightWindow", "ro");
}

export default function FereastraDeZborPage() {
  return <GuidePageView locale="ro" routeKey="flightWindow" />;
}
