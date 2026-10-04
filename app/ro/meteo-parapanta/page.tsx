import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("paraglidingWeather", "ro");
}

export default function MeteoParapantaPage() {
  return <GuidePageView locale="ro" routeKey="paraglidingWeather" />;
}
