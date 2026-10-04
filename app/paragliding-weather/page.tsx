import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("paraglidingWeather", "en");
}

export default function ParaglidingWeatherPage() {
  return <GuidePageView locale="en" routeKey="paraglidingWeather" />;
}
