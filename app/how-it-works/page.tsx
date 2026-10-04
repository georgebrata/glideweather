import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("howItWorks", "en");
}

export default function HowItWorksPage() {
  return <GuidePageView locale="en" routeKey="howItWorks" />;
}
