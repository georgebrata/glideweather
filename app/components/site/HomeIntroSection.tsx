import Link from "next/link";
import { getGuideCopy } from "@/app/content/guides";
import { chromeFor } from "@/app/seo/chrome";
import { GUIDE_ROUTE_KEYS, pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";

export const HomeIntroSection = ({ locale }: { locale: ContentLocale }) => {
  const intro = getGuideCopy(locale).homeIntro;
  const chrome = chromeFor(locale);

  return (
    <section
      aria-labelledby="home-intro-heading"
      className="border-t border-[var(--border-flight)] bg-card/20 px-4 py-10 md:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="home-intro-heading" className="text-2xl font-semibold tracking-tight">
          {intro.heading}
        </h2>
        {intro.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-3 max-w-3xl text-muted-foreground">
            {paragraph}
          </p>
        ))}
        <nav aria-label={chrome.introNavAria} className="mt-6">
          <ul className="flex flex-col gap-2 text-sm">
            {GUIDE_ROUTE_KEYS.map((key) => (
              <li key={key}>
                <Link href={pathForRoute(key, locale)} className="text-primary hover:underline">
                  {chrome.introLinks[key]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={pathForRoute("destinationsHub", locale)} className="text-primary hover:underline">
                {chrome.introLinks.destinationsHub}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};
