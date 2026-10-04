import { PRODUCT_NAME, resolveSiteOrigin } from "../brand";
import { documentLang } from "./locale";
import { getRoute, pathForRoute } from "./routes";
import type { ContentLocale } from "./types";

const origin = resolveSiteOrigin();

type JsonLdNode = Record<string, unknown>;

/** One JSON-LD object. A top-level array has no `@context`, which crashes Safari's parser. */
export function jsonLdDocument(data: JsonLdNode | JsonLdNode[]): JsonLdNode {
  const nodes = Array.isArray(data) ? data : [data];
  if (nodes.length === 1) return nodes[0];

  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDocument(data)) }}
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
    inLanguage: documentLang(locale),
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
    inLanguage: documentLang(locale),
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
    inLanguage: documentLang(locale),
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
    inLanguage: documentLang(locale),
  };
}

export function homeJsonLd(locale: ContentLocale) {
  const route = getRoute("home");
  const path = pathForRoute("home", locale);
  return [
    organizationJsonLd(),
    webSiteJsonLd(locale),
    webPageJsonLd(locale, path, route.titles[locale], route.descriptions[locale]),
  ];
}
