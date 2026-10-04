import Link from "next/link";
import { DESTINATIONS, destinationPath } from "@/app/content/destinations";
import { getGuideContent, getGuideCopy } from "@/app/content/guides";
import { breadcrumbJsonLd, JsonLd, webPageJsonLd } from "@/app/seo/jsonld";
import { getGuideRoute, pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";
import { ContentPageShell } from "./ContentPageShell";
const regionLabels: Record<ContentLocale, Record<string, string>> = {
  en: {
    europe: "Europe",
    asia: "Asia",
    africa: "Africa",
    oceania: "Oceania",
    northAmerica: "North America",
    southAmerica: "South America",
    romania: "Romania",
  },
  ro: {
    europe: "Europa",
    asia: "Asia",
    africa: "Africa",
    oceania: "Oceania",
    northAmerica: "America de Nord",
    southAmerica: "America de Sud",
    romania: "România",
  },
};

export const DestinationsHubView = ({ locale }: { locale: ContentLocale }) => {
  const route = getGuideRoute("destinationsHub");
  const path = route.paths[locale];
  const content = getGuideContent(locale, "destinationsHub");
  const copy = getGuideCopy(locale);
  const homePath = pathForRoute("home", locale);

  const grouped = DESTINATIONS.reduce<Record<string, typeof DESTINATIONS>>((acc, d) => {
    acc[d.region] = acc[d.region] ? [...acc[d.region], d] : [d];
    return acc;
  }, {});

  const jsonLd = [
    webPageJsonLd(locale, path, content.h1, content.lead),
    breadcrumbJsonLd(locale, [
      { name: locale === "ro" ? "Acasă" : "Home", path: homePath },
      { name: content.h1, path },
    ]),
  ];

  return (
    <ContentPageShell locale={locale} currentPath={path}>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-4xl font-semibold tracking-tight">{content.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.lead}</p>
        {content.sections.map((section) => (
          <section key={section.id} className="mt-8">
            {section.paragraphs.map((p) => (
              <p key={p} className="text-muted-foreground">{p}</p>
            ))}
          </section>
        ))}

        <div className="mt-12 space-y-10">
          {Object.entries(grouped).map(([region, items]) => (
            <section key={region}>
              <h2 className="text-xl font-semibold">{regionLabels[locale][region] ?? region}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {items.map((d) => (
                  <li key={d.id} className="rounded-xl border border-[var(--border-flight)] bg-card p-4">
                    <Link href={destinationPath(d.slug, locale)} className="font-medium text-foreground hover:underline">
                      {d.names[locale]}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{d.shortDescriptions[locale]}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">{copy.disclaimer}</p>
      </div>
    </ContentPageShell>
  );
};
