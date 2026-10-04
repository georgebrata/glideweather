import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("faq", "en");
}

export default function FaqPage() {
  return <GuidePageView locale="en" routeKey="faq" />;
}
