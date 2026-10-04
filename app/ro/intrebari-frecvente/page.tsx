import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("faq", "ro");
}

export default function IntrebariFrecventePage() {
  return <GuidePageView locale="ro" routeKey="faq" />;
}
