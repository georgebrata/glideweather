import Link from "next/link";
import { pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";

const labels: Record<ContentLocale, { about: string; destinations: string }> = {
  en: { about: "About", destinations: "Destinations" },
  ro: { about: "Despre", destinations: "Destinații" },
};

export const ConsoleGuideNav = ({ contentLocale }: { contentLocale: ContentLocale }) => (
  <nav
    aria-label={contentLocale === "ro" ? "Ghiduri" : "Guides"}
    className="flex flex-wrap gap-3 text-sm text-muted-foreground"
  >
    <Link href={pathForRoute("about", contentLocale)} className="hover:text-foreground">
      {labels[contentLocale].about}
    </Link>
    <Link href={pathForRoute("howItWorks", contentLocale)} className="hover:text-foreground">
      {contentLocale === "ro" ? "Cum funcționează" : "How it works"}
    </Link>
    <Link href={pathForRoute("destinationsHub", contentLocale)} className="hover:text-foreground">
      {labels[contentLocale].destinations}
    </Link>
  </nav>
);
