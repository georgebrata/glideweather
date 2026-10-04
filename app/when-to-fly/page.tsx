import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("whenToFly", "en");
}

export default function WhenToFlyPage() {
  return <GuidePageView locale="en" routeKey="whenToFly" />;
}
