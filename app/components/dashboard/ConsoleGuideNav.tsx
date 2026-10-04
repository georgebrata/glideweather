import Link from "next/link";
import { chromeFor } from "@/app/seo/chrome";
import { pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";

export const ConsoleGuideNav = ({ contentLocale }: { contentLocale: ContentLocale }) => {
  const chrome = chromeFor(contentLocale);
  return (
    <nav aria-label={chrome.guideNavAria} className="flex flex-wrap gap-3 text-sm text-muted-foreground">
      <Link href={pathForRoute("about", contentLocale)} className="hover:text-foreground">
        {chrome.guides}
      </Link>
      <Link href={pathForRoute("howItWorks", contentLocale)} className="hover:text-foreground">
        {chrome.howItWorks}
      </Link>
      <Link href={pathForRoute("destinationsHub", contentLocale)} className="hover:text-foreground">
        {chrome.destinations}
      </Link>
    </nav>
  );
};
