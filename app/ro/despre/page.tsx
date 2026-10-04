import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("about", "ro");
}

export default function DesprePage() {
  return <GuidePageView locale="ro" routeKey="about" />;
}
