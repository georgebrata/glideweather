import type { Metadata } from "next";
import { FeedbackPageView } from "@/app/components/site/FeedbackPageView";
import { buildPageMetadata } from "@/app/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata("feedback", "ro");
}

export default function FeedbackPageRo() {
  return <FeedbackPageView locale="ro" />;
}
