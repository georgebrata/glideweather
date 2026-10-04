import type { Metadata } from "next";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("howItWorks", "ro");
}

export default function CumFunctioneazaPage() {
  return <GuidePageView locale="ro" routeKey="howItWorks" />;
}
