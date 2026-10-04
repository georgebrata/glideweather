import Link from "next/link";
import { CONTENT_LAST_UPDATED, getGuideContent, getGuideCopy } from "@/app/content/guides";
import { breadcrumbJsonLd, faqPageJsonLd, JsonLd, webPageJsonLd } from "@/app/seo/jsonld";
import { chromeFor } from "@/app/seo/chrome";
import { getGuideRoute, pathForRoute } from "@/app/seo/routes";
import type { ContentLocale, GuideRouteKey } from "@/app/seo/types";
import { ContentPageShell } from "./ContentPageShell";

export const GuidePageView = ({
  locale,
  routeKey,
}: {
  locale: ContentLocale;
  routeKey: GuideRouteKey;
}) => {
  const route = getGuideRoute(routeKey);
  const path = route.paths[locale];
  const content = getGuideContent(locale, routeKey);
  const copy = getGuideCopy(locale);
  const homePath = pathForRoute("home", locale);
  const chrome = chromeFor(locale);
  const homeLabel = chrome.home;

  const jsonLd: Record<string, unknown>[] = [
    webPageJsonLd(locale, path, content.h1, content.lead),
    breadcrumbJsonLd(locale, [
      { name: homeLabel, path: homePath },
      { name: content.h1, path },
    ]),
  ];

  if (routeKey === "faq") {
    jsonLd.push(faqPageJsonLd(locale, path, [...copy.faqItems]));
  }

  return (
    <ContentPageShell locale={locale} currentPath={path}>
      <JsonLd data={jsonLd} />
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <p className="eyebrow">{copy.lastUpdatedLabel}: {CONTENT_LAST_UPDATED}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{content.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.lead}</p>

        {routeKey === "faq" ? (
          <dl className="mt-10 space-y-8">
            {copy.faqItems.map((item) => (
              <div key={item.question}>
                <dt className="text-lg font-medium text-foreground">{item.question}</dt>
                <dd className="mt-2 text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-10 space-y-10">
            {content.sections.map((section) => (
              <section key={section.id} aria-labelledby={`${section.id}-heading`}>
                <h2 id={`${section.id}-heading`} className="text-2xl font-semibold tracking-tight">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        )}

        <aside className="mt-12 rounded-2xl border border-[var(--border-flight)] bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {chrome.continueReading}
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {content.related.map((key) => (
              <li key={key}>
                <Link href={pathForRoute(key, locale)} className="text-primary hover:underline">
                  {chrome.related[key]}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <p className="mt-10 border-t border-[var(--border-flight)] pt-6 text-sm text-muted-foreground">
          {copy.disclaimer}
        </p>
      </article>
    </ContentPageShell>
  );
};
