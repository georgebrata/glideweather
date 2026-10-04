import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("whenToFly", "ro");
}

export default function CandSaZboriPage() {
  return <GuidePageView locale="ro" routeKey="whenToFly" />;
}
