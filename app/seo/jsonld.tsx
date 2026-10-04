import { PRODUCT_NAME, resolveSiteOrigin } from "../brand";
import { pathForRoute } from "./routes";
import type { ContentLocale } from "./types";

const origin = resolveSiteOrigin();

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: PRODUCT_NAME,
    url: origin,
    logo: `${origin}/glideweather-mark.svg`,
  };
}

export function webSiteJsonLd(locale: ContentLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: PRODUCT_NAME,
    url: origin,
    publisher: { "@id": `${origin}/#organization` },
    inLanguage: locale === "ro" ? "ro" : "en",
  };
}

export function webPageJsonLd(
  locale: ContentLocale,
  path: string,
  name: string,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${origin}${path}#webpage`,
    url: `${origin}${path}`,
    name,
    description,
    isPartOf: { "@id": `${origin}/#website` },
    inLanguage: locale === "ro" ? "ro" : "en",
  };
}

export function breadcrumbJsonLd(
  locale: ContentLocale,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

export function faqPageJsonLd(
  locale: ContentLocale,
  path: string,
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${origin}${path}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    inLanguage: locale === "ro" ? "ro" : "en",
  };
}

export function placeJsonLd(
  locale: ContentLocale,
  path: string,
  name: string,
  description: string,
  latitude: number,
  longitude: number,
  addressCountry: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${origin}${path}#place`,
    name,
    description,
    geo: {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry,
    },
    url: `${origin}${path}`,
    inLanguage: locale === "ro" ? "ro" : "en",
  };
}

export function homeJsonLd(locale: ContentLocale) {
  const path = pathForRoute("home", locale);
  const name =
    locale === "ro"
      ? "GlideWeather · Fereastra de zbor parapantă"
      : "GlideWeather · Paragliding flight window";
  const description =
    locale === "ro"
      ? getRouteDescriptionRo()
      : getRouteDescriptionEn();
  return [organizationJsonLd(), webSiteJsonLd(locale), webPageJsonLd(locale, path, name, description)];
}

function getRouteDescriptionEn() {
  return "Hyperlocal paragliding weather with flight confidence scoring and launch-window guidance.";
}

function getRouteDescriptionRo() {
  return "Meteo hiperlocală pentru parapantă cu scor de încredere și ghidaj pentru fereastra de zbor.";
}
