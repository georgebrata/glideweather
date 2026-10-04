import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("about", "en");
}

export default function AboutPage() {
  return <GuidePageView locale="en" routeKey="about" />;
}
