import Link from "next/link";
import { getGuideCopy } from "@/app/content/guides";
import { GUIDE_ROUTE_KEYS, pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";

const linkLabels: Record<ContentLocale, Record<string, string>> = {
  en: {
    about: "Learn what GlideWeather is and who it serves",
    howItWorks: "See how location data becomes a flight window",
    paraglidingWeather: "Understand paragliding wind and instability signals",
    whenToFly: "Know when to check conditions before travelling",
    flightWindow: "Learn how GlideWeather evaluates a flight window",
    faq: "Read paragliding weather FAQ",
    destinationsHub: "Explore popular paragliding destinations",
  },
  ro: {
    about: "Află ce este GlideWeather și pentru cine este",
    howItWorks: "Vezi cum locația devine fereastră de zbor",
    paraglidingWeather: "Înțelege semnalele de vânt și instabilitate",
    whenToFly: "Când să verifici condițiile înainte de drum",
    flightWindow: "Cum evaluează GlideWeather fereastra de zbor",
    faq: "Întrebări frecvente meteo parapantă",
    destinationsHub: "Explorează destinații populare de parapantă",
  },
};

export const HomeIntroSection = ({ locale }: { locale: ContentLocale }) => {
  const intro = getGuideCopy(locale).homeIntro;

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
        <nav aria-label={locale === "ro" ? "Ghiduri GlideWeather" : "GlideWeather guides"} className="mt-6">
          <ul className="flex flex-col gap-2 text-sm">
            {GUIDE_ROUTE_KEYS.map((key) => (
              <li key={key}>
                <Link href={pathForRoute(key, locale)} className="text-primary hover:underline">
                  {linkLabels[locale][key]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={pathForRoute("destinationsHub", locale)} className="text-primary hover:underline">
                {linkLabels[locale].destinationsHub}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};
